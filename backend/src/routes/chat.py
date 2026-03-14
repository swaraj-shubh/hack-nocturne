from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends, HTTPException
from fastapi.websockets import WebSocketState
from src.ws.connection_manager import manager
from src.utils.auth import get_current_user_ws, get_current_user
from src.db.main import messages
from datetime import datetime
from fastapi.responses import JSONResponse
import traceback
import asyncio
import json

chatRouter = APIRouter()

@chatRouter.websocket("/ws/chat")
async def chat_socket(websocket: WebSocket):
    user_id = None
    try:
        await websocket.accept()
        print("🔌 WebSocket connection accepted")

        user = await get_current_user_ws(websocket)
        if not user:
            await websocket.send_text("STATUS:❌ Unauthorized - Please log in")
            await websocket.close(code=1008, reason="Unauthorized")
            return

        user_id = str(user["_id"])
        print(f"✅ User authenticated: {user_id}")

        await manager.connect(websocket, user_id)
        await websocket.send_text("STATUS:✅ Connected successfully")

        try:
            while websocket.client_state == WebSocketState.CONNECTED:
                try:
                    data = await asyncio.wait_for(websocket.receive_json(), timeout=30.0)
                    print(f"📨 Received data from {user_id}: type={data.get('type')}")

                    msg_type = data.get("type")

                    if msg_type == "encrypted-message":
                        await handle_encrypted_message(websocket, user_id, data)

                    elif msg_type == "encrypted-file":
                        await handle_encrypted_file(websocket, user_id, data)

                    elif msg_type == "pair":
                        await handle_pair_request(websocket, user_id, data)

                    elif msg_type == "ping":
                        await websocket.send_text(json.dumps({"type": "pong"}))

                    else:
                        print(f"⚠️ Unknown message type: {msg_type}")
                        await websocket.send_text("STATUS:❌ Unknown message type")

                except asyncio.TimeoutError:
                    try:
                        await websocket.send_text(json.dumps({"type": "ping"}))
                    except Exception:
                        break

                except json.JSONDecodeError as e:
                    print(f"❌ Invalid JSON from {user_id}: {e}")
                    await websocket.send_text("STATUS:❌ Invalid message format")

                except Exception as e:
                    print(f"❌ Error processing message from {user_id}: {e}")
                    traceback.print_exc()
                    await websocket.send_text("STATUS:❌ Message processing error")

        except WebSocketDisconnect:
            print(f"🔌 WebSocket disconnect event for {user_id}")

        except Exception as e:
            print(f"❌ Unexpected error in message loop for {user_id}: {e}")
            traceback.print_exc()

        finally:
            if user_id:
                print(f"🧹 Cleaning up connection for {user_id}")
                manager.disconnect(user_id)

    except Exception as e:
        print(f"❌ Connection error during setup: {e}")
        traceback.print_exc()
        try:
            if websocket.client_state == WebSocketState.CONNECTED:
                await websocket.close(code=1011, reason="Internal server error")
        except Exception:
            pass

        if user_id:
            manager.disconnect(user_id)


async def handle_encrypted_message(websocket: WebSocket, user_id: str, data: dict):
    """Handle encrypted text message sending"""
    try:
        required_fields = ["ciphertext", "encryptedMessage", "iv", "from", "to"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            await websocket.send_text(f"STATUS:❌ Missing fields: {', '.join(missing_fields)}")
            return

        to_user_id = data.get("to")
        from_user_id = data.get("from")

        if from_user_id != user_id:
            await websocket.send_text("STATUS:❌ Sender ID mismatch")
            return

        if not to_user_id:
            await websocket.send_text("STATUS:❌ Missing recipient")
            return

        if not manager.is_user_online(to_user_id):
            await websocket.send_text(f"STATUS:❌ User {to_user_id} is not online")
            return

        manager.pair_users(user_id, to_user_id)
        manager.pair_users(to_user_id, user_id)

        print(f"🔄 Sending text message from {user_id} to {to_user_id}")

        success = await manager.send_to_peer(user_id, data)

        if not success:
            await websocket.send_text("STATUS:❌ Failed to deliver message")

    except Exception as e:
        print(f"❌ Error handling encrypted message: {e}")
        traceback.print_exc()
        await websocket.send_text("STATUS:❌ Message handling error")


async def handle_encrypted_file(websocket: WebSocket, user_id: str, data: dict):
    """Handle encrypted file — base64 encrypted bytes sent directly, no CDN"""
    try:
        # New direct-transfer required fields (no Cloudinary URL layer)
        required_fields = ["fileKyberCiphertext", "encryptedFileData", "fileIv",
                           "fileName", "fileMime", "from", "to"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            await websocket.send_text(f"STATUS:❌ Missing file fields: {', '.join(missing_fields)}")
            return

        to_user_id = data.get("to")
        from_user_id = data.get("from")

        if from_user_id != user_id:
            await websocket.send_text("STATUS:❌ Sender ID mismatch")
            return

        if not to_user_id:
            await websocket.send_text("STATUS:❌ Missing recipient")
            return

        if not manager.is_user_online(to_user_id):
            await websocket.send_text(f"STATUS:❌ User {to_user_id} is not online")
            return

        manager.pair_users(user_id, to_user_id)
        manager.pair_users(to_user_id, user_id)

        print(f"📁 Direct file transfer from {user_id} to {to_user_id}: {data.get('fileName')}")

        success = await manager.send_to_peer(user_id, data)

        if not success:
            await websocket.send_text("STATUS:❌ Failed to deliver file")

    except Exception as e:
        print(f"❌ Error handling encrypted file: {e}")
        traceback.print_exc()
        await websocket.send_text("STATUS:❌ File handling error")


async def handle_pair_request(websocket: WebSocket, user_id: str, data: dict):
    """Handle explicit pairing requests"""
    try:
        peer_id = data.get("to")
        if not peer_id:
            await websocket.send_text("STATUS:❌ Missing 'to' field in pair request")
            return

        if not manager.is_user_online(peer_id):
            await websocket.send_text(f"STATUS:❌ User {peer_id} is not online")
            return

        manager.pair_users(user_id, peer_id)
        await websocket.send_text(f"STATUS:🔐 Paired with {peer_id}")

    except Exception as e:
        print(f"❌ Error handling pair request: {e}")
        await websocket.send_text("STATUS:❌ Pairing error")


@chatRouter.get("/messages/{peer_id}")
async def get_messages_with_signatures(peer_id: str, current_user=Depends(get_current_user)):
    """Retrieve messages between current user and peer"""
    try:
        user_id = str(current_user["_id"])

        message_filter = {
            "$or": [
                {"sender_id": user_id, "receiver_id": peer_id},
                {"sender_id": peer_id, "receiver_id": user_id}
            ]
        }

        cursor = messages.find(message_filter).sort("timestamp", 1)
        message_list = []

        for msg in cursor:
            message_data = {
                "_id": str(msg["_id"]),
                "sender_id": msg["sender_id"],
                "receiver_id": msg["receiver_id"],
                "message_type": msg.get("message_type", "text"),
                "timestamp": msg["timestamp"].isoformat(),
            }

            # ── Encrypted text fields ──────────────────────────────────────────
            if msg.get("ciphertext"):
                message_data["ciphertext"] = msg["ciphertext"]
            if msg.get("encrypted_message"):
                message_data["encrypted_message"] = msg["encrypted_message"]
            if msg.get("iv"):
                message_data["iv"] = msg["iv"]
            if msg.get("signature"):
                message_data["signature"] = msg["signature"]

            # ── Encrypted file fields (direct transfer — no CDN) ───────────────
            if msg.get("file_kyber_ciphertext"):
                message_data["fileKyberCiphertext"] = msg["file_kyber_ciphertext"]
            if msg.get("encrypted_file_data"):
                message_data["encryptedFileData"] = msg["encrypted_file_data"]
            if msg.get("file_iv"):
                message_data["fileIv"] = msg["file_iv"]
            if msg.get("file_signature"):
                message_data["fileSignature"] = msg["file_signature"]
            if msg.get("file_name"):
                message_data["fileName"] = msg["file_name"]
            if msg.get("file_mime"):
                message_data["fileMime"] = msg["file_mime"]

            # ── Plain message (legacy / backward compat) ───────────────────────
            if msg.get("message"):
                message_data["message"] = msg["message"]

            message_list.append(message_data)

        print(f"📜 Retrieved {len(message_list)} messages for {user_id} <-> {peer_id}")
        return message_list

    except Exception as e:
        print(f"❌ Error retrieving messages: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to retrieve messages")


@chatRouter.websocket("/ws/test")
async def test_websocket(websocket: WebSocket):
    """Minimal WebSocket endpoint for testing - NO AUTHENTICATION"""
    try:
        print("🧪 Test WebSocket: Accepting connection...")
        await websocket.accept()
        print("🧪 Test WebSocket: Connection accepted!")
        await websocket.send_text("STATUS:✅ Test connection successful!")

        while True:
            try:
                data = await websocket.receive_text()
                print(f"🧪 Test WebSocket received: {data}")
                await websocket.send_text(f"Echo: {data}")
            except WebSocketDisconnect:
                print("🧪 Test WebSocket: Client disconnected")
                break
            except Exception as e:
                print(f"🧪 Test WebSocket error: {e}")
                break

    except Exception as e:
        print(f"🧪 Test WebSocket setup error: {e}")
        try:
            await websocket.close(code=1011, reason=str(e))
        except Exception:
            pass