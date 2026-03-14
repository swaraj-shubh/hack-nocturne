import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "../context/useAuthStore";
import {
  encryptAndSignMessage,
  decryptAndVerifyMessage,
  decryptMessage,
  encryptFile,
  decryptFile,
  base64ToUint8Array,
} from "../utils/crypto";
import { chatStorage } from "../utils/chatStorage";
import {
  Shield, Send, Loader2, CheckCircle, AlertCircle, Lock,
  Paperclip, X, Image, FileText, Download,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileType(mimeType) {
  if (!mimeType) return "file";
  if (mimeType.startsWith("image/")) return "image";
  return "file";
}

function uint8ArrayToBase64Safe(bytes) {
  const chunkSize = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

// Programmatic download
function triggerDownload(objectUrl, fileName) {
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName || "download";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 200);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebSocketChatBox({ peer }) {
  const { user } = useAuthStore();
  const peerId = peer?.user_id || peer?._id;
  const chatId = [user._id, peerId].sort().join("_");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("🔄 Initializing secure channel...");
  const [isConnecting, setIsConnecting] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  const socket = useRef(null);
  const scrollRef = useRef();
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const [kyberPrivateKey, setKyberPrivateKey] = useState(null);
  const [dilithiumPrivateKey, setDilithiumPrivateKey] = useState(null);

  // ── DB init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const initDB = async () => {
      try { await chatStorage.init(); setDbInitialized(true); }
      catch (error) { console.error("[CHAT] ❌ Failed to initialize IndexedDB:", error); }
    };
    initDB();
  }, []);

  // ── Load keys ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadKeys = async () => {
      if (!dbInitialized || !user) return;
      try {
        const keys = await chatStorage.getKeys(user._id);
        if (keys?.privateKey && keys?.dilithiumPrivateKey) {
          setKyberPrivateKey(keys.privateKey);
          setDilithiumPrivateKey(keys.dilithiumPrivateKey);
          console.log("[CHAT] Keys loaded from IndexedDB");
          return;
        }
        const kyberPrivateKeyBase64 = localStorage.getItem("kyberPrivate");
        const dilithiumPrivateKeyBase64 = localStorage.getItem("dilithiumPrivate");
        if (kyberPrivateKeyBase64 && dilithiumPrivateKeyBase64) {
          setKyberPrivateKey(kyberPrivateKeyBase64);
          setDilithiumPrivateKey(dilithiumPrivateKeyBase64);
          console.log("[CHAT] Keys loaded from localStorage");
          const kyberPublicKey = localStorage.getItem("kyberPublic");
          const dilithiumPublicKey = localStorage.getItem("dilithiumPublic");
          if (kyberPublicKey && dilithiumPublicKey) {
            await chatStorage.storeKeys(user._id, {
              publicKey: kyberPublicKey, privateKey: kyberPrivateKeyBase64,
              dilithiumPublicKey, dilithiumPrivateKey: dilithiumPrivateKeyBase64,
            });
          }
        }
      } catch (error) { console.error("[CHAT] ❌ Error loading keys:", error); }
    };
    loadKeys();
  }, [dbInitialized, user]);

  // ── Online status ──────────────────────────────────────────────────────────
  const checkUserOnlineStatus = useCallback(async () => {
    try {
      const res = await fetch(`https://localhost:8000/api/v1/user/status/${peerId}`, { credentials: "include" });
      if (res.ok) { const data = await res.json(); setIsUserOnline(data.isOnline || false); }
      else setIsUserOnline(false);
    } catch { setIsUserOnline(false); }
  }, [peerId]);

  useEffect(() => {
    if (peerId) {
      checkUserOnlineStatus();
      const interval = setInterval(checkUserOnlineStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [peerId, checkUserOnlineStatus]);

  // ── Fetch peer keys ────────────────────────────────────────────────────────
  const fetchPeerPublicKeys = useCallback(async (id) => {
    const res = await fetch(`https://localhost:8000/api/v1/user/keys/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch peer keys");
    const data = await res.json();
    return { kyberPublicKey: data.kyber_public_key, dilithiumPublicKey: data.dilithium_public_key };
  }, []);

  // ── Load message history ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !peerId || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) return;

    const loadMessages = async () => {
      console.log("[CHAT] loadMessages — chatId:", chatId);
      try {
        let peerDilithiumPublicKey = null;
        try {
          const pk = await fetchPeerPublicKeys(peerId);
          peerDilithiumPublicKey = pk.dilithiumPublicKey;
        } catch {
          console.warn("[CHAT] ⚠️ Could not fetch peer keys");
        }

        // ── 1. Local IndexedDB ───────────────────────────────────────────────
        const localMessages = await chatStorage.getMessages(chatId);
        const processedLocal = await Promise.all(
          localMessages
            .filter(msg =>
              (msg.senderId === user._id && msg.receiverId === peerId) ||
              (msg.senderId === peerId && msg.receiverId === user._id)
            )
            .map(async (msg) => {
              if (msg.type === "file") {
                return {
                  sender: msg.senderId === user._id ? "me" : "them",
                  type: "file", fileUrl: msg.fileUrl, fileName: msg.fileName,
                  fileMime: msg.fileMime, timestamp: msg.timestamp,
                  messageId: msg.id, signatureVerified: msg.signatureVerified || null,
                };
              }
              if (msg.isDecrypted || msg.senderId === user._id) {
                return {
                  sender: msg.senderId === user._id ? "me" : "them",
                  type: "text", text: msg.message, timestamp: msg.timestamp,
                  messageId: msg.id, signatureVerified: msg.signatureVerified || null,
                };
              }
              try {
                let decryptedText; let signatureVerified = null;
                if (msg.signature && peerDilithiumPublicKey) {
                  const result = await decryptAndVerifyMessage({
                    kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: msg.ciphertext,
                    encryptedMessageBase64: msg.encryptedMessage, ivBase64: msg.iv,
                    signature: msg.signature, dilithiumPublicKeyBase64: peerDilithiumPublicKey,
                  });
                  decryptedText = result.message; signatureVerified = result.signatureValid;
                } else {
                  decryptedText = await decryptMessage({
                    kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: msg.ciphertext,
                    encryptedMessageBase64: msg.encryptedMessage, ivBase64: msg.iv,
                  });
                }
                return { sender: "them", type: "text", text: decryptedText, timestamp: msg.timestamp, messageId: msg.id, signatureVerified };
              } catch (e) {
                return { sender: "them", type: "text", text: "[Failed to decrypt]", timestamp: msg.timestamp, messageId: msg.id, signatureVerified: false };
              }
            })
        );
        processedLocal.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(processedLocal);

        // ── 2. Server messages ───────────────────────────────────────────────
        const res = await fetch(`https://localhost:8000/api/v1/messages/${peerId}`, { credentials: "include" });
        if (!res.ok) { console.warn("[CHAT] Server fetch failed:", res.status); return; }
        const serverData = await res.json();
        console.log("[CHAT] Server messages:", serverData.length);

        const serverMessages = [];
        for (const msg of serverData) {
          const isMyMessage = msg.sender_id === user._id;
          console.log(`[CHAT] Server msg — type: "${msg.message_type}", mine: ${isMyMessage}`);

          if (msg.message_type === "encrypted" && msg.ciphertext && msg.encrypted_message && msg.iv) {
            if (isMyMessage) continue;
            const alreadyExists = await chatStorage.messageExists(chatId, msg.timestamp, msg.sender_id, msg.message);
            if (alreadyExists) continue;
            let messageText; let signatureVerified = null;
            try {
              if (msg.signature && peerDilithiumPublicKey) {
                const result = await decryptAndVerifyMessage({
                  kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: msg.ciphertext,
                  encryptedMessageBase64: msg.encrypted_message, ivBase64: msg.iv,
                  signature: msg.signature, dilithiumPublicKeyBase64: peerDilithiumPublicKey,
                });
                messageText = result.message; signatureVerified = result.signatureValid;
              } else {
                messageText = await decryptMessage({
                  kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: msg.ciphertext,
                  encryptedMessageBase64: msg.encrypted_message, ivBase64: msg.iv,
                });
              }
              await chatStorage.storeReceivedMessage(chatId, {
                message: messageText, ciphertext: msg.ciphertext,
                encryptedMessage: msg.encrypted_message, iv: msg.iv,
                signature: msg.signature, signatureVerified,
              }, msg.timestamp, msg.sender_id, msg.receiver_id);
            } catch (e) { messageText = "[Failed to decrypt]"; }
            serverMessages.push({ sender: "them", type: "text", text: messageText, timestamp: msg.timestamp, serverId: msg._id, signatureVerified });

          } else if (msg.message_type === "encrypted-file" && msg.fileKyberCiphertext && msg.encryptedFileData) {
            // Files stored directly as base64 on the server — decrypt inline
            if (isMyMessage) continue;
            try {
              const { fileBytes, signatureValid } = await decryptFile({
                kyberPrivateKeyBase64: kyberPrivateKey,
                kyberCiphertextBase64: msg.fileKyberCiphertext,
                encryptedFileBase64: msg.encryptedFileData,
                ivBase64: msg.fileIv,
                fileSignature: msg.fileSignature,
                dilithiumPublicKeyBase64: peerDilithiumPublicKey,
              });
              const blob = new Blob([fileBytes], { type: msg.fileMime || "application/octet-stream" });
              const localUrl = URL.createObjectURL(blob);
              serverMessages.push({
                sender: "them", type: "file",
                fileUrl: localUrl, fileBytes,
                fileName: msg.fileName, fileMime: msg.fileMime,
                timestamp: msg.timestamp, signatureVerified: signatureValid,
              });
            } catch (e) {
              console.error("[CHAT] ❌ Failed to decrypt server file:", e.message);
              serverMessages.push({
                sender: "them", type: "file", fileUrl: null, fileBytes: null,
                fileName: msg.fileName || "Unknown file", fileMime: msg.fileMime,
                timestamp: msg.timestamp, signatureVerified: false,
              });
            }

          } else if (msg.message) {
            serverMessages.push({
              sender: isMyMessage ? "me" : "them", type: "text",
              text: msg.message, timestamp: msg.timestamp, serverId: msg._id, signatureVerified: null,
            });
          }
        }

        // ── 3. Merge + deduplicate + sort ────────────────────────────────────
        const allMessages = [...processedLocal];
        for (const serverMsg of serverMessages) {
          const isDup = allMessages.some(m => {
            if (m.type !== serverMsg.type) return false;
            if (serverMsg.type === "file")
              return m.fileName === serverMsg.fileName && Math.abs(new Date(m.timestamp) - new Date(serverMsg.timestamp)) < 2000;
            return Math.abs(new Date(m.timestamp) - new Date(serverMsg.timestamp)) < 1000 && m.text === serverMsg.text;
          });
          if (!isDup) allMessages.push(serverMsg);
        }
        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(allMessages);
        console.log(`[CHAT] Final: ${allMessages.length} (text: ${allMessages.filter(m => m.type === "text").length}, files: ${allMessages.filter(m => m.type === "file").length})`);

      } catch (e) {
        console.error("[CHAT] ❌ loadMessages failed:", e);
        setStatus("❌ Failed to load messages");
      }
    };

    loadMessages();
  }, [peerId, user, kyberPrivateKey, dilithiumPrivateKey, dbInitialized, chatId, fetchPeerPublicKeys]);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !peer || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) return;
    let isMounted = true;

    const connectWebSocket = () => {
      if (socket.current?.readyState === WebSocket.OPEN || isConnecting) return;
      setIsConnecting(true);
      const ws = new WebSocket("wss://localhost:8000/api/v1/ws/chat");
      socket.current = ws;

      ws.onopen = () => {
        if (isMounted) {
          setStatus("✅ Secure channel established");
          setIsConnecting(false);
          reconnectAttempts.current = 0;
        }
      };

      ws.onmessage = async (e) => {
        if (!isMounted) return;
        try {
          const rawData = e.data;
          if (typeof rawData === "string" && rawData.startsWith("STATUS:")) {
            setStatus(rawData.replace("STATUS:", ""));
            return;
          }
          const data = JSON.parse(rawData);

          if (data.type === "ping") {
            socket.current?.readyState === WebSocket.OPEN &&
              socket.current.send(JSON.stringify({ type: "pong" }));
            return;
          }
          if (data.type === "pong") return;

          console.log("[CHAT] WS message — type:", data.type);

          if (data.type === "encrypted-message") {
            let decryptedText; let signatureVerified = null;
            let peerDilithiumPublicKey = null;
            try { const pk = await fetchPeerPublicKeys(data.from); peerDilithiumPublicKey = pk.dilithiumPublicKey; }
            catch (keyErr) { console.warn("[CHAT] Could not fetch peer keys:", keyErr.message); }

            if (data.signature && peerDilithiumPublicKey) {
              try {
                const result = await decryptAndVerifyMessage({
                  kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: data.ciphertext,
                  encryptedMessageBase64: data.encryptedMessage, ivBase64: data.iv,
                  signature: data.signature, dilithiumPublicKeyBase64: peerDilithiumPublicKey,
                });
                decryptedText = result.message; signatureVerified = result.signatureValid;
              } catch {
                decryptedText = await decryptMessage({
                  kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: data.ciphertext,
                  encryptedMessageBase64: data.encryptedMessage, ivBase64: data.iv,
                });
                signatureVerified = false;
              }
            } else {
              decryptedText = await decryptMessage({
                kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: data.ciphertext,
                encryptedMessageBase64: data.encryptedMessage, ivBase64: data.iv,
              });
            }
            const newMsg = { sender: "them", type: "text", text: decryptedText, timestamp: new Date().toISOString(), signatureVerified };
            await chatStorage.storeReceivedMessage(chatId, {
              message: decryptedText, ciphertext: data.ciphertext, encryptedMessage: data.encryptedMessage,
              iv: data.iv, signature: data.signature, signatureVerified,
            }, newMsg.timestamp, data.from, user._id);
            setMessages(prev => [...prev, newMsg]);

          } else if (data.type === "encrypted-file") {
            // File arrives as base64 directly in the WS payload — no CDN fetch needed
            console.log("[CHAT] Live file incoming:", data.fileName);
            let peerDilithiumPublicKey = null;
            try { const pk = await fetchPeerPublicKeys(data.from); peerDilithiumPublicKey = pk.dilithiumPublicKey; }
            catch (keyErr) { console.warn("[CHAT] Could not fetch peer keys:", keyErr.message); }

            try {
              const { fileBytes, signatureValid } = await decryptFile({
                kyberPrivateKeyBase64: kyberPrivateKey,
                kyberCiphertextBase64: data.fileKyberCiphertext,
                encryptedFileBase64: data.encryptedFileData,
                ivBase64: data.fileIv,
                fileSignature: data.fileSignature,
                dilithiumPublicKeyBase64: peerDilithiumPublicKey,
              });
              const blob = new Blob([fileBytes], { type: data.fileMime || "application/octet-stream" });
              const localUrl = URL.createObjectURL(blob);
              setMessages(prev => [...prev, {
                sender: "them", type: "file", fileUrl: localUrl, fileBytes,
                fileName: data.fileName, fileMime: data.fileMime,
                timestamp: new Date().toISOString(), signatureVerified: signatureValid,
              }]);
              console.log("[CHAT] Live file decrypted OK:", data.fileName);
            } catch (e) {
              console.error("[CHAT] ❌ Failed to decrypt live file:", e.message);
              setMessages(prev => [...prev, {
                sender: "them", type: "file", fileUrl: null, fileBytes: null,
                fileName: data.fileName || "Unknown file", fileMime: data.fileMime,
                timestamp: new Date().toISOString(), signatureVerified: false,
              }]);
            }

          } else {
            console.warn("[CHAT] Unknown WS message type:", data.type);
          }
        } catch (error) {
          console.error("[CHAT] ❌ WS message processing failed:", error);
        }
      };

      ws.onclose = (event) => {
        if (!isMounted) return;
        setIsConnecting(false);
        if (event.code !== 1000) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          setStatus(`🔄 Re-establishing in ${delay / 1000}s...`);
          reconnectTimeoutRef.current = setTimeout(() => { reconnectAttempts.current++; connectWebSocket(); }, delay);
        }
      };

      ws.onerror = (e) => console.error("[CHAT] WS error:", e);
    };

    connectWebSocket();
    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socket.current) socket.current.close(1000);
    };
  }, [user, peerId, kyberPrivateKey, dilithiumPrivateKey, dbInitialized, chatId, fetchPeerPublicKeys]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Send text ──────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || !socket.current || socket.current.readyState !== WebSocket.OPEN) return;
    try {
      const peerKeys = await fetchPeerPublicKeys(peerId);
      const encryptedPayload = await encryptAndSignMessage(peerKeys.kyberPublicKey, input, dilithiumPrivateKey);
      socket.current.send(JSON.stringify({
        type: "encrypted-message",
        ciphertext: encryptedPayload.kyberCiphertext,
        encryptedMessage: encryptedPayload.encryptedMessage,
        iv: encryptedPayload.iv, signature: encryptedPayload.signature,
        to: peerId, from: user._id,
      }));
      const newMsg = { sender: "me", type: "text", text: input, timestamp: new Date().toISOString(), signatureVerified: true };
      await chatStorage.storeMyMessage(chatId, input, newMsg.timestamp, user._id, peerId);
      setMessages(prev => [...prev, newMsg]);
      setInput("");
    } catch (err) { console.error("[CHAT] ❌ sendMessage:", err); setStatus("❌ Security failure"); }
  };

  // ── File select ────────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setSelectedFile({ file, previewUrl, type: getFileType(file.type) });
    e.target.value = "";
  };

  // ── Send file — encrypted bytes sent directly over WebSocket as base64 ────
  const sendFile = async () => {
    if (!selectedFile || !socket.current || socket.current.readyState !== WebSocket.OPEN) return;
    setIsUploadingFile(true);
    setStatus("🔐 Encrypting file...");
    const localPreviewUrl = selectedFile.previewUrl;
    const fileName = selectedFile.file.name;
    const fileMime = selectedFile.file.type;
    try {
      const peerKeys = await fetchPeerPublicKeys(peerId);
      const arrayBuffer = await selectedFile.file.arrayBuffer();

      // Encrypt the raw file bytes
      const { kyberCiphertext: fileKyberCiphertext, encryptedFile, iv: fileIv, fileSignature } =
        await encryptFile(peerKeys.kyberPublicKey, arrayBuffer, dilithiumPrivateKey);

      // Send encrypted bytes directly — no CDN, no upload step
      setStatus("📡 Transmitting encrypted file...");
      socket.current.send(JSON.stringify({
        type: "encrypted-file",
        fileKyberCiphertext,
        encryptedFileData: encryptedFile,   // base64 encrypted bytes
        fileIv,
        fileSignature,
        fileName,
        fileMime,
        to: peerId,
        from: user._id,
      }));

      // Show the file immediately in our own chat window (unencrypted preview)
      const originalBytes = new Uint8Array(arrayBuffer);
      const localBlob = new Blob([originalBytes], { type: fileMime || "application/octet-stream" });
      const localUrl = fileMime?.startsWith("image/") ? URL.createObjectURL(localBlob) : localPreviewUrl;

      setMessages(prev => [...prev, {
        sender: "me", type: "file",
        fileUrl: localUrl,
        fileBytes: originalBytes,
        fileName, fileMime,
        timestamp: new Date().toISOString(),
        signatureVerified: true,
      }]);
      setSelectedFile(null);
      setStatus("✅ Secure channel established");
    } catch (error) {
      console.error("[CHAT] ❌ sendFile:", error);
      setStatus(`❌ File transfer failed: ${error.message}`);
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
      setSelectedFile(null);
    } finally { setIsUploadingFile(false); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!user || !peer || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-[#0a0a0a]/80 backdrop-blur-xl border border-orange-900/30">
        <Loader2 className="animate-spin h-8 w-8 text-orange-600 mb-4" />
        <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">SYNCING_DEVICES...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white/20 backdrop-blur-xl relative overflow-hidden flex-1">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(0,149,255,0.2)_1px,transparent_1px),linear-gradient(rgba(0,149,255,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <header className="px-6 py-4 bg-white/60 backdrop-blur-md border-b border-slate-200/60 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
              className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg">
              {peer.username?.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isUserOnline ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-slate-300"}`} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-white uppercase italic">{peer.username}</h2>
            <div className="text-[9px] font-bold text-orange-500 tracking-widest uppercase">NODE_LINK: STABLE</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{status}</div>
          <div className="flex items-center gap-1 justify-end mt-0.5 text-[9px] text-orange-500 font-black tracking-widest uppercase italic">
            <Shield className="w-3 h-3" /> PQC_ACTIVE
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto z-10 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <div className="p-5 border border-orange-900/30 rounded-none rotate-45 mb-6">
              <Lock className="w-6 h-6 text-orange-900 -rotate-45" />
            </div>
            <p className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase">Initialize_Secure_Comms</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] shadow-sm border ${msg.sender === "me" ? "bg-slate-900 text-white border-slate-800" : "bg-white/80 text-slate-800 border-slate-200"}`}
                style={{ clipPath: msg.sender === "me" ? "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" : "polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 15%)" }}
              >
                {msg.type === "file" ? (
                  <div className="px-4 py-3">
                    {msg.fileMime?.startsWith("image/") && msg.fileUrl ? (
                      <div className="mb-2">
                        <img src={msg.fileUrl} alt={msg.fileName}
                          className="max-w-full max-h-48 object-cover rounded-none border border-white/10"
                          onError={(e) => { e.target.style.display = "none"; }} />
                      </div>
                    ) : (
                      <div className={`flex items-center gap-3 mb-2 p-3 ${msg.sender === "me" ? "bg-white/10" : "bg-slate-100"}`}>
                        <FileText className="w-6 h-6 flex-shrink-0 text-cyan-400" />
                        <span className="text-[10px] font-bold tracking-tight truncate max-w-[160px]">{msg.fileName || "Unknown file"}</span>
                      </div>
                    )}

                    {(msg.fileUrl || msg.fileBytes) ? (
                      <button
                        onClick={() => {
                          if (msg.fileBytes) {
                            const freshBlob = new Blob([msg.fileBytes], { type: msg.fileMime || "application/octet-stream" });
                            const freshUrl = URL.createObjectURL(freshBlob);
                            triggerDownload(freshUrl, msg.fileName);
                            setTimeout(() => URL.revokeObjectURL(freshUrl), 5000);
                          } else if (msg.fileUrl) {
                            triggerDownload(msg.fileUrl, msg.fileName);
                          }
                        }}
                        className={`flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase mt-1 cursor-pointer bg-transparent border-none p-0 ${msg.sender === "me" ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-500"}`}
                      >
                        <Download className="w-3 h-3" /> DOWNLOAD_FILE
                      </button>
                    ) : (
                      <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider mt-1">⚠ FILE UNAVAILABLE</p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="text-[8px] font-black opacity-50 uppercase tracking-tighter">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.sender === "them" && msg.signatureVerified !== null && (
                        <div className={`text-[8px] font-black tracking-widest flex items-center gap-1 uppercase ${msg.signatureVerified ? "text-emerald-500" : "text-red-500"}`}>
                          {msg.signatureVerified ? <CheckCircle className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                          {msg.signatureVerified ? "VERIFIED" : "TAMPERED"}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-3">
                    <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="text-[8px] font-black opacity-50 uppercase tracking-tighter">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.sender === "them" && msg.signatureVerified !== null && (
                        <div className={`text-[8px] font-black tracking-widest flex items-center gap-1 uppercase ${msg.signatureVerified ? "text-emerald-500" : "text-red-500"}`}>
                          {msg.signatureVerified ? <CheckCircle className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                          {msg.signatureVerified ? "VERIFIED" : "TAMPERED"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </main>

      {selectedFile && (
        <div className="px-6 py-3 bg-cyan-50/80 border-t border-cyan-200 z-10 flex items-center gap-4">
          {selectedFile.previewUrl
            ? <img src={selectedFile.previewUrl} alt="preview" className="w-12 h-12 object-cover border border-cyan-200" />
            : <div className="w-12 h-12 bg-slate-100 border border-slate-200 flex items-center justify-center"><FileText className="w-5 h-5 text-slate-400" /></div>}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate">{selectedFile.file.name}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              {(selectedFile.file.size / 1024).toFixed(1)} KB · PQC_ENCRYPTED_DIRECT_TRANSFER
            </p>
          </div>
          <button onClick={() => { if (selectedFile.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl); setSelectedFile(null); }}
            className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <footer className="p-6 bg-white/60 backdrop-blur-md border-t border-slate-200 z-10">
        <div className="flex items-center gap-3">
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf,.doc,.docx,.txt,.zip"
            className="hidden" onChange={handleFileSelect} />
          <button onClick={() => fileInputRef.current?.click()}
            disabled={isConnecting || socket.current?.readyState !== WebSocket.OPEN || isUploadingFile}
            className="p-4 bg-white/80 border border-slate-200 text-slate-400 hover:text-cyan-600 hover:border-cyan-400 transition-all disabled:opacity-40"
            title="Attach file">
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="relative flex-1">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={selectedFile ? "Add a message or just send the file..." : "ENCRYPT_DATA_PACKET..."}
              onKeyDown={(e) => { if (e.key === "Enter") { if (selectedFile) sendFile(); else if (input.trim()) sendMessage(); } }}
              className="w-full px-5 py-4 bg-white/80 border border-slate-200 text-xs font-bold tracking-tight text-slate-900 placeholder-slate-300 focus:outline-none focus:border-cyan-500 transition-all rounded-none"
              disabled={isConnecting || socket.current?.readyState !== WebSocket.OPEN || isUploadingFile} />
          </div>
          <button onClick={selectedFile ? sendFile : sendMessage}
            disabled={(!input.trim() && !selectedFile) || isConnecting || socket.current?.readyState !== WebSocket.OPEN || isUploadingFile}
            style={{ clipPath: "polygon(15% 0, 100% 0, 100% 75%, 85% 100%, 0 100%, 0 25%)" }}
            className="px-8 py-4 bg-slate-900 text-white hover:bg-cyan-600 transition-all duration-300 disabled:bg-slate-200 disabled:text-slate-400 flex items-center gap-2">
            {isUploadingFile || isConnecting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : selectedFile
                ? <><Image className="w-3.5 h-3.5" /><span className="text-[10px] font-black tracking-widest">SEND_FILE</span></>
                : <><Send className="w-3.5 h-3.5" /><span className="text-[10px] font-black tracking-widest">TRANSMIT</span></>}
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 text-[8px] font-black tracking-[0.2em] text-zinc-600 uppercase">
          <span className="flex items-center gap-1"><Shield className="w-2.5 h-2.5 text-orange-600" /> SECURE_TUNNEL: ENABLED</span>
          <span>PACKETS: {messages.length}</span>
        </div>
      </footer>
      
      <style>{`
        ::-webkit-scrollbar {
          width: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: #442200;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
    </div>
  );
}