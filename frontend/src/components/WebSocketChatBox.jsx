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
  Paperclip, X, Image, FileText, Download, Zap,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileType(mimeType) {
  if (!mimeType) return "file";
  if (mimeType.startsWith("image/")) return "image";
  return "file";
}

function triggerDownload(objectUrl, fileName) {
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName || "download";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 200);
}

// ─── Shared message metadata row ──────────────────────────────────────────────
function MsgMeta({ msg }) {
  return (
    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5">
      <span className="text-[7px] font-mono text-zinc-700 uppercase tracking-wider">
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
      {msg.sender === "them" && msg.signatureVerified !== null && (
        <div className={`flex items-center gap-1 text-[7px] font-black tracking-widest uppercase ${
          msg.signatureVerified ? "text-orange-600/80" : "text-red-500/80"
        }`}>
          {msg.signatureVerified
            ? <CheckCircle className="w-2.5 h-2.5" />
            : <AlertCircle className="w-2.5 h-2.5" />}
          {msg.signatureVerified ? "SIG_OK" : "TAMPERED"}
        </div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebSocketChatBox({ peer }) {
  const { user } = useAuthStore();
  const peerId = peer?.user_id || peer?._id;
  const chatId = [user._id, peerId].sort().join("_");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("INITIALIZING...");
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
      catch (error) { console.error("[CHAT] Failed to initialize IndexedDB:", error); }
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
          return;
        }
        const kyberPrivateKeyBase64 = localStorage.getItem("kyberPrivate");
        const dilithiumPrivateKeyBase64 = localStorage.getItem("dilithiumPrivate");
        if (kyberPrivateKeyBase64 && dilithiumPrivateKeyBase64) {
          setKyberPrivateKey(kyberPrivateKeyBase64);
          setDilithiumPrivateKey(dilithiumPrivateKeyBase64);
          const kyberPublicKey = localStorage.getItem("kyberPublic");
          const dilithiumPublicKey = localStorage.getItem("dilithiumPublic");
          if (kyberPublicKey && dilithiumPublicKey) {
            await chatStorage.storeKeys(user._id, {
              publicKey: kyberPublicKey, privateKey: kyberPrivateKeyBase64,
              dilithiumPublicKey, dilithiumPrivateKey: dilithiumPrivateKeyBase64,
            });
          }
        }
      } catch (error) { console.error("[CHAT] Error loading keys:", error); }
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
      try {
        let peerDilithiumPublicKey = null;
        try {
          const pk = await fetchPeerPublicKeys(peerId);
          peerDilithiumPublicKey = pk.dilithiumPublicKey;
        } catch { console.warn("[CHAT] Could not fetch peer keys"); }

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
              } catch {
                return { sender: "them", type: "text", text: "[DECRYPT_FAILED]", timestamp: msg.timestamp, messageId: msg.id, signatureVerified: false };
              }
            })
        );
        processedLocal.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(processedLocal);

        const res = await fetch(`https://localhost:8000/api/v1/messages/${peerId}`, { credentials: "include" });
        if (!res.ok) return;
        const serverData = await res.json();

        const serverMessages = [];
        for (const msg of serverData) {
          const isMyMessage = msg.sender_id === user._id;

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
            } catch { messageText = "[DECRYPT_FAILED]"; }
            serverMessages.push({ sender: "them", type: "text", text: messageText, timestamp: msg.timestamp, serverId: msg._id, signatureVerified });

          } else if (msg.message_type === "encrypted-file" && msg.fileKyberCiphertext && msg.encryptedFileData) {
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
              serverMessages.push({
                sender: "them", type: "file",
                fileUrl: URL.createObjectURL(blob), fileBytes,
                fileName: msg.fileName, fileMime: msg.fileMime,
                timestamp: msg.timestamp, signatureVerified: signatureValid,
              });
            } catch {
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
      } catch {
        setStatus("LOAD_ERR");
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
      setStatus("HANDSHAKING...");
      const ws = new WebSocket("wss://localhost:8000/api/v1/ws/chat");
      socket.current = ws;

      ws.onopen = () => {
        if (isMounted) { setStatus("CHANNEL_OPEN"); setIsConnecting(false); reconnectAttempts.current = 0; }
      };

      ws.onmessage = async (e) => {
        if (!isMounted) return;
        try {
          const rawData = e.data;
          if (typeof rawData === "string" && rawData.startsWith("STATUS:")) {
            const s = rawData.replace("STATUS:", "").trim();
            if (s.includes("Connected") || s.includes("delivered")) setStatus("CHANNEL_OPEN");
            else if (s.includes("❌")) setStatus("TX_FAIL");
            else setStatus(s.toUpperCase().replace(/\s+/g, "_").slice(0, 20));
            return;
          }
          const data = JSON.parse(rawData);
          if (data.type === "ping") {
            socket.current?.readyState === WebSocket.OPEN && socket.current.send(JSON.stringify({ type: "pong" }));
            return;
          }
          if (data.type === "pong") return;

          if (data.type === "encrypted-message") {
            let decryptedText; let signatureVerified = null;
            let peerDilithiumPublicKey = null;
            try { const pk = await fetchPeerPublicKeys(data.from); peerDilithiumPublicKey = pk.dilithiumPublicKey; } catch { }

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
            let peerDilithiumPublicKey = null;
            try { const pk = await fetchPeerPublicKeys(data.from); peerDilithiumPublicKey = pk.dilithiumPublicKey; } catch { }
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
              setMessages(prev => [...prev, {
                sender: "them", type: "file", fileUrl: URL.createObjectURL(blob), fileBytes,
                fileName: data.fileName, fileMime: data.fileMime,
                timestamp: new Date().toISOString(), signatureVerified: signatureValid,
              }]);
            } catch {
              setMessages(prev => [...prev, {
                sender: "them", type: "file", fileUrl: null, fileBytes: null,
                fileName: data.fileName || "Unknown file", fileMime: data.fileMime,
                timestamp: new Date().toISOString(), signatureVerified: false,
              }]);
            }
          }
        } catch { }
      };

      ws.onclose = (event) => {
        if (!isMounted) return;
        setIsConnecting(false);
        if (event.code !== 1000) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          setStatus(`RETRY_${delay / 1000}S`);
          reconnectTimeoutRef.current = setTimeout(() => { reconnectAttempts.current++; connectWebSocket(); }, delay);
        }
      };

      ws.onerror = () => setStatus("WS_ERROR");
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
    } catch { setStatus("TX_FAIL"); }
  };

  // ── File select ────────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setSelectedFile({ file, previewUrl, type: getFileType(file.type) });
    e.target.value = "";
  };

  // ── Send file ──────────────────────────────────────────────────────────────
  const sendFile = async () => {
    if (!selectedFile || !socket.current || socket.current.readyState !== WebSocket.OPEN) return;
    setIsUploadingFile(true);
    setStatus("ENCRYPTING...");
    const localPreviewUrl = selectedFile.previewUrl;
    const fileName = selectedFile.file.name;
    const fileMime = selectedFile.file.type;
    try {
      const peerKeys = await fetchPeerPublicKeys(peerId);
      const arrayBuffer = await selectedFile.file.arrayBuffer();
      const { kyberCiphertext: fileKyberCiphertext, encryptedFile, iv: fileIv, fileSignature } =
        await encryptFile(peerKeys.kyberPublicKey, arrayBuffer, dilithiumPrivateKey);

      setStatus("TRANSMITTING...");
      socket.current.send(JSON.stringify({
        type: "encrypted-file",
        fileKyberCiphertext, encryptedFileData: encryptedFile,
        fileIv, fileSignature, fileName, fileMime,
        to: peerId, from: user._id,
      }));

      const originalBytes = new Uint8Array(arrayBuffer);
      const localBlob = new Blob([originalBytes], { type: fileMime || "application/octet-stream" });
      const localUrl = fileMime?.startsWith("image/") ? URL.createObjectURL(localBlob) : localPreviewUrl;

      setMessages(prev => [...prev, {
        sender: "me", type: "file", fileUrl: localUrl, fileBytes: originalBytes,
        fileName, fileMime, timestamp: new Date().toISOString(), signatureVerified: true,
      }]);
      setSelectedFile(null);
      setStatus("CHANNEL_OPEN");
    } catch {
      setStatus("TX_FAIL");
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
      setSelectedFile(null);
    } finally { setIsUploadingFile(false); }
  };

  const isWsReady = socket.current?.readyState === WebSocket.OPEN;
  const canSend = isWsReady && !isConnecting && !isUploadingFile;

  // ── Loading gate ──────────────────────────────────────────────────────────
  if (!user || !peer || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a]">
        <Loader2 className="animate-spin h-7 w-7 text-orange-600 mb-4" />
        <p className="text-[9px] font-black tracking-[0.4em] text-zinc-600 uppercase font-mono">SYNCING_DEVICES</p>
      </div>
    );
  }

  // Status indicator colour
  const dotClass = status === "CHANNEL_OPEN"
    ? "bg-orange-500 shadow-[0_0_7px_#ea580c]"
    : status.includes("FAIL") || status.includes("ERR")
      ? "bg-red-500 shadow-[0_0_7px_#ef4444]"
      : "bg-amber-400 shadow-[0_0_7px_#fbbf24] animate-pulse";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a0a] relative overflow-hidden">

      <style>{`
        .msg-me  { clip-path: polygon(0 0, 100% 0, 100% 80%, 93% 100%, 0 100%); }
        .msg-them{ clip-path: polygon(7% 0, 100% 0, 100% 100%, 0 100%, 0 20%); }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #7c2d12; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: #ea580c; }
      `}</style>

      {/* Ambient grid overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,102,0,0.3)_1px,transparent_1px),linear-gradient(rgba(255,102,0,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Top hairline glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/50 to-transparent z-10" />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative flex items-center justify-between px-5 py-3 bg-[#0d0d0d] border-b border-orange-900/40 z-10 flex-shrink-0">
        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-orange-600 via-orange-700/50 to-transparent" />

        <div className="flex items-center gap-3 pl-2">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-9 h-9 bg-orange-950/70 border border-orange-800/50 text-orange-400 flex items-center justify-center font-black text-sm uppercase italic select-none"
              style={{ clipPath: "polygon(10% 0, 100% 0, 100% 75%, 90% 100%, 0 100%, 0 25%)" }}
            >
              {peer.username?.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0d0d0d] ${isUserOnline ? "bg-orange-500 shadow-[0_0_6px_#ea580c]" : "bg-zinc-700"}`} />
          </div>

          <div>
            <h2 className="text-[13px] font-black tracking-wider text-white uppercase italic leading-none">
              {peer.username}
            </h2>
            <p className="text-[8px] font-bold tracking-[0.2em] uppercase mt-0.5 font-mono"
               style={{ color: isUserOnline ? "#c2410c" : "#3f3f46" }}>
              {isUserOnline ? "ONLINE · PEER_READY" : "OFFLINE · QUEUED_MODE"}
            </p>
          </div>
        </div>

        {/* Right: status + shield */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
              <span className="text-[9px] font-mono font-black tracking-widest text-zinc-400 uppercase">
                {status}
              </span>
            </div>
            <div className="text-[7px] font-mono text-orange-900/60 tracking-widest uppercase mt-0.5">
              PKT/{messages.length.toString().padStart(4, "0")}
            </div>
          </div>
          <div className="w-8 h-8 border border-orange-900/50 bg-orange-950/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-orange-700" />
          </div>
        </div>
      </header>

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <main className="flex-1 px-5 py-4 overflow-y-auto z-10 space-y-3 chat-scroll min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 select-none">
            <div className="p-4 border border-orange-900/30 rotate-45 opacity-20">
              <Lock className="w-5 h-5 text-orange-800 -rotate-45" />
            </div>
            <p className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase font-mono opacity-40">
              AWAITING_TRANSMISSION
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[72%] ${msg.sender === "me" ? "msg-me bg-orange-950/70 border border-orange-800/40" : "msg-them bg-[#141414] border border-zinc-800/70"}`}>

                {msg.type === "file" ? (
                  <div className="px-4 py-3">
                    {msg.fileMime?.startsWith("image/") && msg.fileUrl ? (
                      <div className="mb-2 border border-orange-900/30 overflow-hidden">
                        <img src={msg.fileUrl} alt={msg.fileName}
                          className="max-w-full max-h-44 object-cover w-full"
                          onError={(e) => { e.target.style.display = "none"; }} />
                      </div>
                    ) : (
                      <div className={`flex items-center gap-3 mb-2 px-3 py-2 border ${msg.sender === "me" ? "bg-orange-900/20 border-orange-800/30" : "bg-zinc-900 border-zinc-800"}`}>
                        <FileText className="w-4 h-4 text-orange-700 flex-shrink-0" />
                        <span className="text-[9px] font-mono font-bold text-zinc-400 truncate max-w-[140px] uppercase tracking-wide">
                          {msg.fileName || "UNKNOWN_FILE"}
                        </span>
                      </div>
                    )}
                    {(msg.fileUrl || msg.fileBytes) ? (
                      <button
                        onClick={() => {
                          if (msg.fileBytes) {
                            const b = new Blob([msg.fileBytes], { type: msg.fileMime || "application/octet-stream" });
                            const u = URL.createObjectURL(b);
                            triggerDownload(u, msg.fileName);
                            setTimeout(() => URL.revokeObjectURL(u), 5000);
                          } else if (msg.fileUrl) {
                            triggerDownload(msg.fileUrl, msg.fileName);
                          }
                        }}
                        className="flex items-center gap-1.5 text-[8px] font-black tracking-widest uppercase text-orange-600 hover:text-orange-500 transition-colors bg-transparent border-none p-0 mt-1 font-mono"
                      >
                        <Download className="w-2.5 h-2.5" /> EXTRACT_FILE
                      </button>
                    ) : (
                      <p className="text-[8px] text-red-600/70 font-mono font-bold uppercase tracking-wider mt-1">⚠ FILE_CORRUPT</p>
                    )}
                    <MsgMeta msg={msg} />
                  </div>
                ) : (
                  <div className="px-4 py-2.5">
                    <p className={`text-[11px] leading-relaxed tracking-wide ${msg.sender === "me" ? "text-orange-100" : "text-zinc-300"}`}>
                      {msg.text}
                    </p>
                    <MsgMeta msg={msg} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </main>

      {/* ── File preview strip ────────────────────────────────────────────── */}
      {selectedFile && (
        <div className="flex-shrink-0 px-5 py-2.5 border-t border-orange-900/40 bg-[#0d0d0d] z-10 flex items-center gap-3">
          <div className="w-[3px] h-10 bg-orange-600 flex-shrink-0" />
          {selectedFile.previewUrl
            ? <img src={selectedFile.previewUrl} alt="preview" className="w-10 h-10 object-cover border border-orange-900/50 flex-shrink-0" />
            : <div className="w-10 h-10 bg-orange-950/40 border border-orange-900/40 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-orange-800" />
              </div>}
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest truncate font-mono">{selectedFile.file.name}</p>
            <p className="text-[8px] text-zinc-700 font-mono uppercase mt-0.5 tracking-wide">
              {(selectedFile.file.size / 1024).toFixed(1)} KB · PQC_ARMED
            </p>
          </div>
          <button
            onClick={() => { if (selectedFile.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl); setSelectedFile(null); }}
            className="text-zinc-700 hover:text-red-600 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Footer / Input ────────────────────────────────────────────────── */}
      <footer className="flex-shrink-0 px-5 py-3.5 border-t border-orange-900/40 bg-[#0d0d0d] z-10">
        <div className="flex items-center gap-2">
          {/* Attach button */}
          <input ref={fileInputRef} type="file"
            accept="image/*,application/pdf,.doc,.docx,.txt,.zip"
            className="hidden" onChange={handleFileSelect} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!canSend}
            className="flex-shrink-0 w-9 h-9 border border-orange-900/50 bg-orange-950/20 text-orange-800 hover:text-orange-500 hover:border-orange-700/60 transition-colors disabled:opacity-30 flex items-center justify-center"
          >
            <Paperclip className="w-3.5 h-3.5" />
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedFile ? "OPTIONAL_MSG..." : "TRANSMIT_PAYLOAD..."}
              onKeyDown={(e) => { if (e.key === "Enter") { if (selectedFile) sendFile(); else if (input.trim()) sendMessage(); } }}
              disabled={!canSend}
              className="w-full px-4 py-2 bg-[#111111] border border-zinc-800/80 text-[11px] font-mono text-orange-100 placeholder-zinc-700 focus:outline-none focus:border-orange-800/60 transition-colors disabled:opacity-40 tracking-wide pr-8"
            />
            {/* Blinking cursor accent */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-px h-3 bg-orange-700/50 animate-pulse" />
          </div>

          {/* Send button */}
          <button
            onClick={selectedFile ? sendFile : sendMessage}
            disabled={(!input.trim() && !selectedFile) || !canSend}
            style={{ clipPath: "polygon(12% 0, 100% 0, 100% 72%, 88% 100%, 0 100%, 0 28%)" }}
            className="flex-shrink-0 px-5 py-2 bg-orange-800 hover:bg-orange-700 text-white transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 flex items-center gap-2 font-black text-[9px] tracking-widest uppercase font-mono"
          >
            {isUploadingFile || isConnecting
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : selectedFile
                ? <><Zap className="w-3 h-3" /> SEND</>
                : <><Send className="w-3 h-3" /> TX</>}
          </button>
        </div>

        {/* Bottom meta bar */}
        <div className="flex items-center justify-between mt-2 text-[7px] font-mono tracking-widest uppercase">
          <span className="flex items-center gap-1.5 text-zinc-700">
            <Shield className="w-2.5 h-2.5 text-orange-900" />
            ML-KEM-768 + ML-DSA-65
          </span>
          <span className={isWsReady ? "text-orange-800" : "text-zinc-700"}>
            {isWsReady ? "◉ LIVE" : "◌ OFFLINE"}
          </span>
        </div>
      </footer>
    </div>
  );
}