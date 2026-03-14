from fastapi import WebSocket
from typing import Dict
from src.db.main import messages
from datetime import datetime, timezone
import json
import asyncio
from fastapi.websockets import WebSocketState


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.paired_users: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            old_ws = self.active_connections[user_id]
            try:
                if old_ws.client_state == WebSocketState.CONNECTED:
                    await old_ws.close(code=1000, reason="New connection established")
            except Exception as e:
                print(f"⚠️ Error closing old connection for {user_id}: {e}")
            finally:
                self.active_connections.pop(user_id, None)
        self.active_connections[user_id] = websocket
        print(f"🔗 User {user_id} connected. Active: {list(self.active_connections.keys())}")

    def disconnect(self, user_id: str):
        websocket = self.active_connections.pop(user_id, None)
        if websocket:
            try:
                if websocket.client_state == WebSocketState.CONNECTED:
                    asyncio.create_task(websocket.close(code=1000, reason="User disconnected"))
            except Exception as e:
                print(f"⚠️ Error closing websocket for {user_id}: {e}")
        self.paired_users.pop(user_id, None)
        to_remove = [k for k, v in self.paired_users.items() if v == user_id]
        for k in to_remove:
            self.paired_users.pop(k, None)
        print(f"🔌 Disconnected {user_id}. Active: {list(self.active_connections.keys())}")

    def pair_users(self, sender_id: str, receiver_id: str):
        if sender_id in self.active_connections and receiver_id in self.active_connections:
            self.paired_users[sender_id] = receiver_id
            print(f"👥 Paired: {sender_id} -> {receiver_id}")
        else:
            print(f"❌ Cannot pair — one or both not connected: {sender_id}, {receiver_id}")

    def is_mutually_paired(self, user1_id: str, user2_id: str) -> bool:
        return (
            self.paired_users.get(user1_id) == user2_id and
            self.paired_users.get(user2_id) == user1_id
        )

    async def send_status_message(self, user_id: str, status: str):
        if user_id not in self.active_connections:
            return False
        websocket = self.active_connections[user_id]
        try:
            if websocket.client_state != WebSocketState.CONNECTED:
                self.disconnect(user_id)
                return False
            await websocket.send_text(f"STATUS:{status}")
            return True
        except Exception as e:
            print(f"❌ Failed to send status to {user_id}: {e}")
            self.disconnect(user_id)
            return False

    async def send_to_peer(self, sender_id: str, encrypted_payload):
        receiver_id = encrypted_payload.get("to")
        if not receiver_id:
            await self.send_status_message(sender_id, "❌ No receiver specified")
            return False

        message_type = (encrypted_payload.get("type") or "").strip()
        print(f"📤 {sender_id} → {receiver_id} | type: '{message_type}'")

        if receiver_id not in self.active_connections:
            await self.send_status_message(sender_id, f"❌ User {receiver_id} is offline")
            return False

        receiver_ws = self.active_connections[receiver_id]
        if receiver_ws.client_state != WebSocketState.CONNECTED:
            self.disconnect(receiver_id)
            await self.send_status_message(sender_id, f"❌ User {receiver_id} disconnected")
            return False

        try:
            # Forward the full payload as-is — backend never reads encrypted content
            await receiver_ws.send_text(json.dumps(encrypted_payload))
            print(f"✅ Forwarded '{message_type}' to {receiver_id}")

            try:
                if message_type == "encrypted-message":
                    # ── Text message ───────────────────────────────────────────
                    ciphertext = encrypted_payload.get("ciphertext")
                    encrypted_message = encrypted_payload.get("encryptedMessage")
                    iv = encrypted_payload.get("iv")

                    if not all([ciphertext, encrypted_message, iv]):
                        print(f"⚠️ encrypted-message missing required fields — skipping DB save")
                    else:
                        message_doc = {
                            "sender_id": sender_id,
                            "receiver_id": receiver_id,
                            "message_type": "encrypted",
                            "ciphertext": ciphertext,
                            "encrypted_message": encrypted_message,
                            "iv": iv,
                            "timestamp": datetime.now(timezone.utc),
                        }
                        if encrypted_payload.get("signature"):
                            message_doc["signature"] = encrypted_payload["signature"]
                        result = messages.insert_one(message_doc)
                        print(f"✅ Text message saved: {result.inserted_id}")

                elif message_type == "encrypted-file":
                    # ── File message — direct base64 transfer, no CDN ──────────
                    file_kyber_ciphertext = encrypted_payload.get("fileKyberCiphertext")
                    encrypted_file_data = encrypted_payload.get("encryptedFileData")
                    file_iv = encrypted_payload.get("fileIv")

                    if not all([file_kyber_ciphertext, encrypted_file_data, file_iv]):
                        print(f"⚠️ encrypted-file missing required fields — skipping DB save")
                        print(f"   fileKyberCiphertext={bool(file_kyber_ciphertext)}")
                        print(f"   encryptedFileData={bool(encrypted_file_data)}")
                        print(f"   fileIv={bool(file_iv)}")
                    else:
                        message_doc = {
                            "sender_id": sender_id,
                            "receiver_id": receiver_id,
                            "message_type": "encrypted-file",
                            # Encrypted file bytes (base64) — no CDN involved
                            "file_kyber_ciphertext": file_kyber_ciphertext,
                            "encrypted_file_data": encrypted_file_data,
                            "file_iv": file_iv,
                            "file_signature": encrypted_payload.get("fileSignature"),
                            # Metadata (not sensitive)
                            "file_name": encrypted_payload.get("fileName"),
                            "file_mime": encrypted_payload.get("fileMime"),
                            "timestamp": datetime.now(timezone.utc),
                        }
                        result = messages.insert_one(message_doc)
                        print(f"✅ File message saved: {result.inserted_id} | {encrypted_payload.get('fileName')}")

                else:
                    print(f"⚠️ Unrecognised message type '{message_type}' — forwarded but not saved to DB")

            except Exception as db_error:
                print(f"❌ DB save failed: {db_error}")
                import traceback
                traceback.print_exc()
                # Never fail delivery because of a DB error

            await self.send_status_message(sender_id, "✅ Message delivered")
            return True

        except Exception as e:
            print(f"❌ Failed to send to {receiver_id}: {e}")
            await self.send_status_message(sender_id, f"❌ Delivery failed: {str(e)}")
            if "ConnectionClosed" in str(type(e)) or "websocket" in str(e).lower():
                self.disconnect(receiver_id)
            return False

    async def broadcast_user_status(self, user_id: str, status: str):
        paired_users = [uid for uid, paired_with in self.paired_users.items() if paired_with == user_id]
        for paired_user in paired_users:
            await self.send_status_message(paired_user, f"👤 {user_id} is {status}")

    def get_active_users(self) -> list:
        return list(self.active_connections.keys())

    def is_user_online(self, user_id: str) -> bool:
        if user_id not in self.active_connections:
            return False
        return self.active_connections[user_id].client_state == WebSocketState.CONNECTED

    async def cleanup_stale_connections(self):
        stale_users = [
            uid for uid, ws in self.active_connections.items()
            if ws.client_state != WebSocketState.CONNECTED
        ]
        for uid in stale_users:
            print(f"🧹 Cleaning up stale connection: {uid}")
            self.disconnect(uid)


manager = ConnectionManager()