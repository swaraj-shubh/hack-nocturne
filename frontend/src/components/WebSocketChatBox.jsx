import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "../context/useAuthStore";
import {
  encryptAndSignMessage,
  decryptAndVerifyMessage,
  encryptMessage,
  decryptMessage,
} from "../utils/crypto";
import { chatStorage } from "../utils/chatStorage";
import { Shield, Send, Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react";

export default function WebSocketChatBox({ peer }) {
  const { user } = useAuthStore();
  const peerId = peer?.user_id || peer?._id;
  const chatId = [user._id, peerId].sort().join('_');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("🔄 Initializing secure channel...");
  const [isConnecting, setIsConnecting] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(true);

  const socket = useRef(null);
  const scrollRef = useRef();
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const [kyberPrivateKey, setKyberPrivateKey] = useState(null);
  const [dilithiumPrivateKey, setDilithiumPrivateKey] = useState(null);

  // LOGIC PRESERVATION: (Existing effects and functions remain identical)
  useEffect(() => {
    const initDB = async () => {
      try {
        await chatStorage.init();
        setDbInitialized(true);
      } catch (error) {
        console.error("❌ Failed to initialize IndexedDB:", error);
      }
    };
    initDB();
  }, []);

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
              publicKey: kyberPublicKey,
              privateKey: kyberPrivateKeyBase64,
              dilithiumPublicKey: dilithiumPublicKey,
              dilithiumPrivateKey: dilithiumPrivateKeyBase64
            });
          }
        }
      } catch (error) { console.error("❌ Error loading keys:", error); }
    };
    loadKeys();
  }, [dbInitialized, user]);

  const checkUserOnlineStatus = useCallback(async () => {
    try {
      const res = await fetch(`https://localhost:8000/api/v1/user/status/${peerId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setIsUserOnline(data.isOnline || false);
      } else { setIsUserOnline(false); }
    } catch (error) { setIsUserOnline(false); }
  }, [peerId]);

  useEffect(() => {
    if (peerId) {
      checkUserOnlineStatus();
      const interval = setInterval(checkUserOnlineStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [peerId, checkUserOnlineStatus]);

  const fetchPeerPublicKeys = useCallback(async (peerId) => {
    try {
      const res = await fetch(`https://localhost:8000/api/v1/user/keys/${peerId}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch peer keys`);
      const data = await res.json();
      return { kyberPublicKey: data.kyber_public_key, dilithiumPublicKey: data.dilithium_public_key };
    } catch (error) { throw error; }
  }, []);

  useEffect(() => {
    if (!user || !peerId || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) return;
    const loadMessages = async () => {
      try {
        const localMessages = await chatStorage.getMessages(chatId);
        let peerDilithiumPublicKey = null;
        try {
          const peerKeys = await fetchPeerPublicKeys(peerId);
          peerDilithiumPublicKey = peerKeys.dilithiumPublicKey;
        } catch (error) { console.warn("⚠️ Signatures will not be verified"); }
        const processedLocal = await Promise.all(
          localMessages
            .filter(msg => (msg.senderId === user._id && msg.receiverId === peerId) || (msg.senderId === peerId && msg.receiverId === user._id))
            .map(async (msg) => {
              if (msg.isDecrypted || msg.sender === 'me') {
                return { sender: msg.senderId === user._id ? "me" : "them", text: msg.message, timestamp: msg.timestamp, messageId: msg.id, signatureVerified: msg.signatureVerified || null };
              } else {
                try {
                  let decryptedText; let signatureVerified = null;
                  if (msg.signature && peerDilithiumPublicKey) {
                    const result = await decryptAndVerifyMessage({ kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: msg.ciphertext, encryptedMessageBase64: msg.encryptedMessage, ivBase64: msg.iv, signature: msg.signature, dilithiumPublicKeyBase64: peerDilithiumPublicKey });
                    decryptedText = result.message; signatureVerified = result.signatureValid;
                  } else {
                    decryptedText = await decryptMessage({ kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: msg.ciphertext, encryptedMessageBase64: msg.encryptedMessage, ivBase64: msg.iv });
                  }
                  return { sender: msg.senderId === user._id ? "me" : "them", text: decryptedText, timestamp: msg.timestamp, messageId: msg.id, signatureVerified: signatureVerified };
                } catch (error) { return { sender: msg.senderId === user._id ? "me" : "them", text: "[Failed to decrypt]", timestamp: msg.timestamp, messageId: msg.id, signatureVerified: false }; }
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
          if (await chatStorage.messageExists(chatId, msg.timestamp, msg.sender_id, msg.message)) continue;
          let messageText; let signatureVerified = null;
          if (msg.message_type === "encrypted" && msg.ciphertext && msg.encrypted_message && msg.iv) {
            if (isMyMessage) continue;
            try {
              if (msg.signature && peerDilithiumPublicKey) {
                const result = await decryptAndVerifyMessage({ kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: msg.ciphertext, encryptedMessageBase64: msg.encrypted_message, ivBase64: msg.iv, signature: msg.signature, dilithiumPublicKeyBase64: peerDilithiumPublicKey });
                messageText = result.message; signatureVerified = result.signatureValid;
              } else {
                messageText = await decryptMessage({ kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: msg.ciphertext, encryptedMessageBase64: msg.encrypted_message, ivBase64: msg.iv });
              }
              await chatStorage.storeReceivedMessage(chatId, { message: messageText, ciphertext: msg.ciphertext, encryptedMessage: msg.encrypted_message, iv: msg.iv, signature: msg.signature, signatureVerified: signatureVerified }, msg.timestamp, msg.sender_id, msg.receiver_id);
            } catch (e) { messageText = "[Failed to decrypt]"; }
          } else { messageText = msg.message || "[No message content]"; }
          serverMessages.push({ sender: isMyMessage ? "me" : "them", text: messageText, timestamp: msg.timestamp, serverId: msg._id, signatureVerified: signatureVerified });
        }
        const allMessages = [...processedLocal];
        serverMessages.forEach(serverMsg => {
          if (!allMessages.some(localMsg => Math.abs(new Date(localMsg.timestamp) - new Date(serverMsg.timestamp)) < 1000 && localMsg.text === serverMsg.text)) { allMessages.push(serverMsg); }
        });
        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(allMessages);
      } catch (err) { setStatus("❌ Failed to load messages"); }
    };
    loadMessages();
  }, [peerId, user, kyberPrivateKey, dilithiumPrivateKey, dbInitialized, chatId, fetchPeerPublicKeys]);

  useEffect(() => {
    if (!user || !peer || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) return;
    let isMounted = true;
    const connectWebSocket = () => {
      if (socket.current?.readyState === WebSocket.OPEN || isConnecting) return;
      setIsConnecting(true);
      const ws = new WebSocket("wss://localhost:8000/api/v1/ws/chat");
      socket.current = ws;
      ws.onopen = () => { if (isMounted) { setStatus("✅ Secure channel established"); setIsConnecting(false); reconnectAttempts.current = 0; } };
      ws.onmessage = async (e) => {
        if (!isMounted) return;
        try {
          const rawData = e.data;
          if (typeof rawData === "string" && rawData.startsWith("STATUS:")) { setStatus(rawData.replace("STATUS:", "")); return; }
          const data = JSON.parse(rawData);
          if (data.type === "encrypted-message") {
            let decryptedText; let signatureVerified = null;
            let peerDilithiumPublicKey = null;
            try { const pk = await fetchPeerPublicKeys(data.from); peerDilithiumPublicKey = pk.dilithiumPublicKey; } catch (e) {}
            if (data.signature && peerDilithiumPublicKey) {
              try {
                const result = await decryptAndVerifyMessage({ kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: data.ciphertext, encryptedMessageBase64: data.encryptedMessage, ivBase64: data.iv, signature: data.signature, dilithiumPublicKeyBase64: peerDilithiumPublicKey });
                decryptedText = result.message; signatureVerified = result.signatureValid;
              } catch (e) { decryptedText = await decryptMessage({ kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: data.ciphertext, encryptedMessageBase64: data.encryptedMessage, ivBase64: data.iv }); signatureVerified = false; }
            } else { decryptedText = await decryptMessage({ kyberPrivateKeyBase64: kyberPrivateKey, kyberCiphertextBase64: data.ciphertext, encryptedMessageBase64: data.encryptedMessage, ivBase64: data.iv }); }
            const newMessage = { sender: "them", text: decryptedText, timestamp: new Date().toISOString(), signatureVerified };
            await chatStorage.storeReceivedMessage(chatId, { message: decryptedText, ciphertext: data.ciphertext, encryptedMessage: data.encryptedMessage, iv: data.iv, signature: data.signature, signatureVerified }, newMessage.timestamp, data.from, user._id);
            setMessages((prev) => [...prev, newMessage]);
          }
        } catch (error) { console.error("❌ Message processing failed:", error); }
      };
      ws.onclose = (event) => {
        if (!isMounted) return; setIsConnecting(false);
        if (event.code !== 1000) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          setStatus(`🔄 Re-establishing in ${delay/1000}s...`);
          reconnectTimeoutRef.current = setTimeout(() => { reconnectAttempts.current++; connectWebSocket(); }, delay);
        }
      };
    };
    connectWebSocket();
    return () => { isMounted = false; if (socket.current) socket.current.close(1000); };
  }, [user, peerId, kyberPrivateKey, dilithiumPrivateKey, dbInitialized, chatId, fetchPeerPublicKeys]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !socket.current || socket.current.readyState !== WebSocket.OPEN) return;
    try {
      const peerKeys = await fetchPeerPublicKeys(peerId);
      const encryptedPayload = await encryptAndSignMessage(peerKeys.kyberPublicKey, input, dilithiumPrivateKey);
      const payload = { type: "encrypted-message", ciphertext: encryptedPayload.kyberCiphertext, encryptedMessage: encryptedPayload.encryptedMessage, iv: encryptedPayload.iv, signature: encryptedPayload.signature, to: peerId, from: user._id };
      socket.current.send(JSON.stringify(payload));
      const newMessage = { sender: "me", text: input, timestamp: new Date().toISOString(), signatureVerified: true };
      await chatStorage.storeMyMessage(chatId, input, newMessage.timestamp, user._id, peerId);
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    } catch (error) { setStatus("❌ Security failure"); }
  };

  // UI RENDERING - Updated to Industrial Orange & Matte Black
  if (!user || !peer || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-[#0a0a0a]/80 backdrop-blur-xl border border-orange-900/30">
        <Loader2 className="animate-spin h-8 w-8 text-orange-600 mb-4" />
        <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">SYNCING_DEVICES...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a0a]/40 backdrop-blur-xl relative overflow-hidden flex-1 selection:bg-orange-500/30 selection:text-orange-200">
      {/* Hardware Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,102,0,0.2)_1px,transparent_1px),linear-gradient(rgba(255,102,0,0.2)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      {/* Header Panel */}
      <header className="px-6 py-4 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-orange-900/40 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div 
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
              className="w-10 h-10 bg-orange-600 text-black flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(234,88,12,0.3)]"
            >
              {peer.username?.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${isUserOnline ? 'bg-orange-500 shadow-[0_0_8px_#ea580c]' : 'bg-zinc-800'}`}></div>
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

      {/* Message Stream */}
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
                className={`max-w-[80%] px-5 py-3 shadow-lg border ${
                  msg.sender === "me"
                    ? "bg-orange-600 text-black border-orange-700 rounded-none shadow-orange-900/20"
                    : "bg-zinc-900/90 text-white border-orange-900/30 rounded-none"
                }`}
                style={{ 
                    clipPath: msg.sender === 'me' ? 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' : 'polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 15%)' 
                }}
              >
                <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10">
                  <span className={`text-[8px] font-black uppercase tracking-tighter ${msg.sender === "me" ? "text-orange-900" : "text-zinc-500"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  {msg.sender === "them" && msg.signatureVerified !== null && (
                    <div className={`text-[8px] font-black tracking-widest flex items-center gap-1 uppercase ${msg.signatureVerified ? 'text-orange-500' : 'text-red-500'}`}>
                      {msg.signatureVerified ? <CheckCircle className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                      {msg.signatureVerified ? 'VERIFIED' : 'TAMPERED'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </main>

      {/* Input Panel */}
      <footer className="p-6 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-orange-900/40 z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENCRYPT_DATA_PACKET..."
              onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) sendMessage(); }}
              className="w-full px-5 py-4 bg-[#111] border border-orange-900/30 text-xs font-bold tracking-tight text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all rounded-none font-mono"
              disabled={isConnecting || socket.current?.readyState !== WebSocket.OPEN}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isConnecting || socket.current?.readyState !== WebSocket.OPEN}
            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 75%, 85% 100%, 0 100%, 0 25%)' }}
            className="px-8 py-4 bg-orange-600 text-black hover:bg-orange-500 transition-all duration-300 disabled:bg-zinc-900 disabled:text-zinc-700 flex items-center gap-2"
          >
            {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5" /><span className="text-[10px] font-black tracking-widest">TRANSMIT</span></>}
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