import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "../context/useAuthStore";
import {
  encryptAndSignMessage,
  decryptAndVerifyMessage,
  encryptMessage,
  decryptMessage,
} from "../utils/crypto";
import { chatStorage } from "../utils/chatStorage";

export default function WebSocketChatBox({ peer }) {
  const { user } = useAuthStore();
  const peerId = peer?.user_id || peer?._id;
  
  const chatId = [user._id, peerId].sort().join('_');
  
  console.log("🔍 Chat ID:", chatId);
  console.log("🔍 Current User ID:", user._id);
  console.log("🔍 Peer ID:", peerId);

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

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        await chatStorage.init();
        setDbInitialized(true);
        console.log("✅ IndexedDB initialized");
      } catch (error) {
        console.error("❌ Failed to initialize IndexedDB:", error);
      }
    };
    initDB();
  }, []);

  const [kyberPrivateKey, setKyberPrivateKey] = useState(null);
  const [dilithiumPrivateKey, setDilithiumPrivateKey] = useState(null);
  
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
      } catch (error) {
        console.error("❌ Error loading keys:", error);
      }
    };
    
    loadKeys();
  }, [dbInitialized, user]);

  const checkUserOnlineStatus = useCallback(async () => {
    try {
      const res = await fetch(`https://localhost:8000/api/v1/user/status/${peerId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setIsUserOnline(data.isOnline || false);
      } else {
        setIsUserOnline(false);
      }
    } catch (error) {
      console.error("❌ Error checking user status:", error);
      setIsUserOnline(false);
    }
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
      const res = await fetch(`https://localhost:8000/api/v1/user/keys/${peerId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch peer public keys: ${res.status}`);
      }
      const data = await res.json();
      
      if (!data.kyber_public_key) {
        throw new Error("No kyberPublicKey found in response");
      }
      
      if (!data.dilithium_public_key) {
        throw new Error("No dilithiumPublicKey found in response");
      }
      
      try {
        atob(data.kyber_public_key);
        atob(data.dilithium_public_key);
      } catch (base64Error) {
        throw new Error(`Invalid Base64 public keys: ${base64Error.message}`);
      }
      
      return {
        kyberPublicKey: data.kyber_public_key,
        dilithiumPublicKey: data.dilithium_public_key
      };
    } catch (error) {
      console.error("❌ Error fetching peer public keys:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!user || !peerId || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) return;

    const loadMessages = async () => {
      try {
        console.log("📱 Loading messages for chat:", chatId);
        
        const localMessages = await chatStorage.getMessages(chatId);
        console.log("📱 Local messages found:", localMessages.length);
        
        let peerDilithiumPublicKey = null;
        try {
          const peerKeys = await fetchPeerPublicKeys(peerId);
          peerDilithiumPublicKey = peerKeys.dilithiumPublicKey;
        } catch (error) {
          console.warn("⚠️ Could not fetch peer's Dilithium key, signatures will not be verified:", error);
        }
        
        const processedLocal = await Promise.all(
          localMessages
            .filter(msg => {
              const isMyMessage = msg.senderId === user._id && msg.receiverId === peerId;
              const isTheirMessage = msg.senderId === peerId && msg.receiverId === user._id;
              return isMyMessage || isTheirMessage;
            })
            .map(async (msg) => {
              if (msg.isDecrypted || msg.sender === 'me') {
                return {
                  sender: msg.senderId === user._id ? "me" : "them",
                  text: msg.message,
                  timestamp: msg.timestamp,
                  messageId: msg.id,
                  signatureVerified: msg.signatureVerified || null
                };
              } else {
                try {
                  let decryptedText;
                  let signatureVerified = null;
                  
                  if (msg.signature && peerDilithiumPublicKey) {
                    const result = await decryptAndVerifyMessage({
                      kyberPrivateKeyBase64: kyberPrivateKey,
                      kyberCiphertextBase64: msg.ciphertext,
                      encryptedMessageBase64: msg.encryptedMessage,
                      ivBase64: msg.iv,
                      signature: msg.signature,
                      dilithiumPublicKeyBase64: peerDilithiumPublicKey,
                    });
                    decryptedText = result.message;
                    signatureVerified = result.signatureValid;
                  } else {
                    decryptedText = await decryptMessage({
                      kyberPrivateKeyBase64: kyberPrivateKey,
                      kyberCiphertextBase64: msg.ciphertext,
                      encryptedMessageBase64: msg.encryptedMessage,
                      ivBase64: msg.iv,
                    });
                  }
                  
                  return {
                    sender: msg.senderId === user._id ? "me" : "them",
                    text: decryptedText,
                    timestamp: msg.timestamp,
                    messageId: msg.id,
                    signatureVerified: signatureVerified
                  };
                } catch (error) {
                  console.error("❌ Failed to decrypt local message:", error);
                  return {
                    sender: msg.senderId === user._id ? "me" : "them",
                    text: "[Failed to decrypt message]",
                    timestamp: msg.timestamp,
                    messageId: msg.id,
                    signatureVerified: false
                  };
                }
              }
            })
        );

        processedLocal.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(processedLocal);
        console.log("📱 Processed local messages:", processedLocal.length);

        const res = await fetch(
          `https://localhost:8000/api/v1/messages/${peerId}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.warn(`⚠️ Server fetch failed: ${res.status}`);
          return;
        }

        const serverData = await res.json();
        console.log("📜 Server messages found:", serverData.length);

        const serverMessages = [];
        
        for (const msg of serverData) {
          try {
            const isMyMessage = msg.sender_id === user._id;
            const messageTimestamp = msg.timestamp;
            
            const alreadyExists = await chatStorage.messageExists(
              chatId, 
              messageTimestamp, 
              msg.sender_id, 
              msg.message
            );
            
            if (alreadyExists) {
              console.log("⏭️ Message already exists locally, skipping");
              continue;
            }

            let messageText;
            let signatureVerified = null;

            if (msg.message_type === "encrypted" && msg.ciphertext && msg.encrypted_message && msg.iv) {
              if (isMyMessage) {
                console.log("📤 Found your encrypted message on server");
                continue;
              } else {
                if (msg.signature && peerDilithiumPublicKey) {
                  try {
                    const result = await decryptAndVerifyMessage({
                      kyberPrivateKeyBase64: kyberPrivateKey,
                      kyberCiphertextBase64: msg.ciphertext,
                      encryptedMessageBase64: msg.encrypted_message,
                      ivBase64: msg.iv,
                      signature: msg.signature,
                      dilithiumPublicKeyBase64: peerDilithiumPublicKey,
                    });
                    messageText = result.message;
                    signatureVerified = result.signatureValid;
                  } catch (sigError) {
                    console.warn("⚠️ Signature verification failed, falling back to regular decryption:", sigError);
                    messageText = await decryptMessage({
                      kyberPrivateKeyBase64: kyberPrivateKey,
                      kyberCiphertextBase64: msg.ciphertext,
                      encryptedMessageBase64: msg.encrypted_message,
                      ivBase64: msg.iv,
                    });
                    signatureVerified = false;
                  }
                } else {
                  messageText = await decryptMessage({
                    kyberPrivateKeyBase64: kyberPrivateKey,
                    kyberCiphertextBase64: msg.ciphertext,
                    encryptedMessageBase64: msg.encrypted_message,
                    ivBase64: msg.iv,
                  });
                }
                
                await chatStorage.storeReceivedMessage(
                  chatId,
                  {
                    message: messageText,
                    ciphertext: msg.ciphertext,
                    encryptedMessage: msg.encrypted_message,
                    iv: msg.iv,
                    signature: msg.signature,
                    signatureVerified: signatureVerified,
                  },
                  messageTimestamp,
                  msg.sender_id,
                  msg.receiver_id
                );
                console.log("📥 Stored new received message locally");
              }
            } else if (msg.message) {
              messageText = msg.message;
            } else {
              messageText = "[Unable to decrypt message]";
            }

            serverMessages.push({
              sender: isMyMessage ? "me" : "them",
              text: messageText,
              timestamp: messageTimestamp,
              serverId: msg._id,
              signatureVerified: signatureVerified
            });
          } catch (decryptError) {
            console.error("❌ Failed to process server message:", msg._id, decryptError);
            serverMessages.push({
              sender: msg.sender_id === user._id ? "me" : "them",
              text: "[Failed to decrypt message]",
              timestamp: msg.timestamp,
              serverId: msg._id,
              signatureVerified: false
            });
          }
        }

        const allMessages = [...processedLocal];
        
        for (const serverMsg of serverMessages) {
          const isDuplicate = allMessages.some(localMsg => 
            Math.abs(new Date(localMsg.timestamp) - new Date(serverMsg.timestamp)) < 1000 &&
            localMsg.text === serverMsg.text &&
            localMsg.sender === serverMsg.sender
          );
          
          if (!isDuplicate) {
            allMessages.push(serverMsg);
          }
        }

        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        console.log("📜 Final merged messages:", allMessages.length);
        setMessages(allMessages);
        
      } catch (err) {
        console.error("❌ Error loading messages:", err);
        setStatus("❌ Failed to load messages");
      }
    };

    loadMessages();
  }, [peerId, user, kyberPrivateKey, dilithiumPrivateKey, dbInitialized, chatId, fetchPeerPublicKeys]);

  useEffect(() => {
    if (!user || !peer || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) {
      return;
    }

    let isMounted = true;
    
    const connectWebSocket = () => {
      if (socket.current?.readyState === WebSocket.OPEN || isConnecting) {
        return;
      }

      setIsConnecting(true);
      const ws = new WebSocket("wss://localhost:8000/api/v1/ws/chat");
      socket.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        setStatus("✅ Secure channel established");
        setIsConnecting(false);
        reconnectAttempts.current = 0;
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = async (e) => {
        if (!isMounted) return;

        try {
          const rawData = e.data;

          if (typeof rawData === "string" && rawData.startsWith("STATUS:")) {
            const statusMessage = rawData.replace("STATUS:", "");
            setStatus(statusMessage);
            
            if (statusMessage.includes("Unauthorized")) {
              ws.close();
              return;
            }
            return;
          }

          const data = JSON.parse(rawData);

          if (data.type === "encrypted-message") {
            let decryptedText;
            let signatureVerified = null;
            
            let peerDilithiumPublicKey = null;
            try {
              const peerKeys = await fetchPeerPublicKeys(data.from);
              peerDilithiumPublicKey = peerKeys.dilithiumPublicKey;
            } catch (error) {
              console.warn("⚠️ Could not fetch peer's Dilithium key:", error);
            }
            
            if (data.signature && peerDilithiumPublicKey) {
              try {
                const result = await decryptAndVerifyMessage({
                  kyberPrivateKeyBase64: kyberPrivateKey,
                  kyberCiphertextBase64: data.ciphertext,
                  encryptedMessageBase64: data.encryptedMessage,
                  ivBase64: data.iv,
                  signature: data.signature,
                  dilithiumPublicKeyBase64: peerDilithiumPublicKey,
                });
                decryptedText = result.message;
                signatureVerified = result.signatureValid;
              } catch (sigError) {
                console.warn("⚠️ Signature verification failed, falling back to regular decryption:", sigError);
                decryptedText = await decryptMessage({
                  kyberPrivateKeyBase64: kyberPrivateKey,
                  kyberCiphertextBase64: data.ciphertext,
                  encryptedMessageBase64: data.encryptedMessage,
                  ivBase64: data.iv,
                });
                signatureVerified = false;
              }
            } else {
              decryptedText = await decryptMessage({
                kyberPrivateKeyBase64: kyberPrivateKey,
                kyberCiphertextBase64: data.ciphertext,
                encryptedMessageBase64: data.encryptedMessage,
                ivBase64: data.iv,
              });
            }

            const newMessage = {
              sender: "them",
              text: decryptedText,
              timestamp: new Date().toISOString(),
              signatureVerified: signatureVerified,
            };

            await chatStorage.storeReceivedMessage(
              chatId,
              {
                message: decryptedText,
                ciphertext: data.ciphertext,
                encryptedMessage: data.encryptedMessage,
                iv: data.iv,
                signature: data.signature,
                signatureVerified: signatureVerified,
              },
              newMessage.timestamp,
              data.from,
              user._id
            );

            setMessages((prev) => [...prev, newMessage]);
          }
        } catch (error) {
          console.error("❌ Message processing failed:", error);
        }
      };

      ws.onclose = (event) => {
        if (!isMounted) return;
        setIsConnecting(false);
        
        if (event.code !== 1000 && event.code !== 1001 && event.code !== 1008) {
          if (reconnectAttempts.current < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
            setStatus(`🔄 Re-establishing secure channel in ${delay/1000}s...`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted && !isConnecting) {
                reconnectAttempts.current++;
                connectWebSocket();
              }
            }, delay);
          } else {
            setStatus("❌ Connection failed - Security protocol terminated");
          }
        } else {
          setStatus("❌ Secure channel disconnected");
        }
      };

      ws.onerror = (error) => {
        if (!isMounted) return;
        setStatus("❌ Security protocol violation");
        setIsConnecting(false);
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      setIsConnecting(false);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (socket.current) {
        socket.current.close(1000, "Component unmounting");
        socket.current = null;
      }
    };
  }, [user, peerId, kyberPrivateKey, dilithiumPrivateKey, dbInitialized, chatId, fetchPeerPublicKeys]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
      setStatus("❌ Secure channel not available");
      return;
    }

    try {
      const peerKeys = await fetchPeerPublicKeys(peerId);
      
      const encryptedPayload = await encryptAndSignMessage(
        peerKeys.kyberPublicKey, 
        input, 
        dilithiumPrivateKey
      );

      const payload = {
        type: "encrypted-message",
        ciphertext: encryptedPayload.kyberCiphertext,
        encryptedMessage: encryptedPayload.encryptedMessage,
        iv: encryptedPayload.iv,
        signature: encryptedPayload.signature,
        to: peerId,
        from: user._id,
      };

      socket.current.send(JSON.stringify(payload));
      
      const newMessage = {
        sender: "me",
        text: input,
        timestamp: new Date().toISOString(),
        signatureVerified: true
      };

      await chatStorage.storeMyMessage(
        chatId, 
        input, 
        newMessage.timestamp,
        user._id,
        peerId
      );
      
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    } catch (error) {
      console.error("❌ Encryption or send failed:", error);
      setStatus("❌ Security protocol failure");
    }
  };

  if (!user || !peer || !kyberPrivateKey || !dilithiumPrivateKey || !dbInitialized) {
    return (
      <div className="flex items-center justify-center h-[500px] w-full max-w-md mx-auto bg-black rounded-2xl shadow-[0_0_25px_#00ff9940] border border-[#00ff99]/20 relative overflow-hidden">
        {/* Cyber grid background */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[linear-gradient(90deg,rgba(0,255,100,0.2)_1px,transparent_1px),linear-gradient(rgba(0,255,100,0.2)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff99] mx-auto mb-4"></div>
          <p className="text-[#00ff99] font-mono font-medium">INITIALIZING SECURE CHANNEL...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] w-full bg-black rounded-2xl shadow-[0_0_25px_#00ff9940] border border-[#00ff99]/20 backdrop-blur-sm overflow-hidden relative">

      {/* Cyber grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(0,255,100,0.2)_1px,transparent_1px),linear-gradient(rgba(0,255,100,0.2)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Scanning line */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="w-full h-0.5 bg-[#00ff99]/20 animate-[scan_3s_linear_infinite]"></div>
      </div>

      {/* Header */}
      <header className="px-4 py-3 bg-[#001a0d]/80 backdrop-blur-md border-b border-[#00ff99]/30 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00ff99] to-[#00cc77] rounded-full flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_#00ff99] font-mono">
                {peer.username?.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                isUserOnline ? 'bg-[#00ff99] shadow-[0_0_10px_#00ff99]' : 'bg-[#ff4444]'
              }`}></div>
            </div>
            <div>
              <h2 className="font-bold text-[#00ff99] text-base tracking-wider font-mono">
                {peer.username}
              </h2>
              <div className="flex items-center space-x-2">
                {/* <div className={`w-2 h-2 rounded-full ${
                  isUserOnline ? 'bg-[#00ff99] animate-pulse shadow-[0_0_5px_#00ff99]' : 'bg-[#ff4444]'
                }`}></div>
                <span className="text-[#00ff99]/80 text-xs font-mono">
                  {isUserOnline ? 'ACTIVE' : 'OFFLINE'}
                </span> */}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#00ff99]/80 font-mono">{status}</div>
            <div className="text-[10px] text-[#00ff99]/60 mt-0.5 font-mono">QUANTUM-SAFE ENCRYPTED</div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-black/50 to-[#001a0d]/30 backdrop-blur-sm relative z-10">
        <div className="flex flex-col space-y-3">
          {messages.length === 0 && (
            <div className="text-center mt-16">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00ff99]/20 to-[#00cc77]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00ff99]/30">
                <svg className="w-8 h-8 text-[#00ff99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-[#00ff99]/80 font-mono text-sm">INITIATE SECURE COMMUNICATION</p>
              <p className="text-[#00ff99]/60 text-xs mt-1 font-mono">ALL TRAFFIC IS QUANTUM-RESISTANT</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border font-mono ${
                  msg.sender === "me"
                    ? "bg-gradient-to-br from-[#00ff99] to-[#00cc77] text-black border-[#00ff99]/50 rounded-br-md shadow-[0_0_15px_#00ff9940]"
                    : "bg-gradient-to-br from-[#003315]/80 to-[#00220d]/80 text-[#00ff99] border-[#00ff99]/30 rounded-bl-md"
                }`}
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div className="flex flex-col">
                  <span className="leading-relaxed text-sm">{msg.text}</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] opacity-60 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    {msg.sender === "them" && msg.signatureVerified !== null && (
                      <div className="text-xs flex items-center space-x-1">
                        {msg.signatureVerified ? (
                          <>
                            <svg className="w-3 h-3 text-[#00ff99]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[#00ff99] text-[10px] font-mono">VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-[#ff4444]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[#ff4444] text-[10px] font-mono">UNVERIFIED</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Input Footer */}
      <footer className="p-4 bg-[#001a0d]/80 backdrop-blur-md border-t border-[#00ff99]/30 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="flex-grow relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"ENTER ENCRYPTED MESSAGE..."}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) sendMessage();
              }}
              className="w-full px-4 py-3 text-sm rounded-2xl bg-[#00220d]/80 backdrop-blur-sm border border-[#00ff99]/30 text-[#00ff99] placeholder-[#00ff99]/60 focus:outline-none focus:ring-2 focus:ring-[#00ff99]/50 focus:border-[#00ff99]/50 transition-all duration-200 font-mono"
              spellCheck={false}
              disabled={isConnecting || socket.current?.readyState !== WebSocket.OPEN}
            />
            {input.trim() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-[#00ff99] rounded-full animate-pulse shadow-[0_0_5px_#00ff99]"></div>
              </div>
            )}
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isConnecting || socket.current?.readyState !== WebSocket.OPEN}
            className="px-6 py-3 bg-gradient-to-r from-[#00ff99] to-[#00cc77] hover:from-[#00e688] hover:to-[#00bb66] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-semibold rounded-2xl transition-all duration-200 shadow-[0_0_15px_#00ff99] disabled:shadow-none transform hover:scale-105 disabled:transform-none flex items-center space-x-2 font-mono"
          >
            {isConnecting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="text-sm">SEND</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-[10px] text-[#00ff99]/60 font-mono">
          <span>🔒 LATTICE-BASED ENCRYPTION ACTIVE</span>
          <span>{messages.length} MESSAGES SECURED</span>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400px); }
        }
        @keyframes flicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            opacity: 1;
          }
          20%, 24%, 55% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}