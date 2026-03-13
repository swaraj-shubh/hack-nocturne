import { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import WebSocketChatBox from "../components/WebSocketChatBox";
import { useAuthStore } from "../context/useAuthStore";
import { useChatStore } from "../context/useChatStore";
import { Shield, Cpu, Lock, Sparkles } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuthStore();
  const { peer } = useChatStore();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (peer && !selectedUser) setSelectedUser(peer);
  }, [peer, selectedUser]);

  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-black text-[#00ff99] flex items-center justify-center">
  //       <div className="bg-[#001a0d]/70 border border-[#00ff99]/20 rounded-2xl p-8 backdrop-blur-md text-center shadow-[0_0_20px_#00ff9940]">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff99] mx-auto mb-4"></div>
  //         <p className="font-mono text-[#00ffcc]">Initializing Secure Channel...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-black text-[#00ff99] relative overflow-hidden font-mono">
      {/* === Neon Grid Background === */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,255,100,0.05)_0%,_black_80%)]"></div>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(0,255,100,0.2)_1px,transparent_1px),linear-gradient(rgba(0,255,100,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* === Scanning Line Animation === */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="w-full h-1 bg-[#00ff99]/20 animate-[scan_4s_linear_infinite]"></div>
      </div>

      {/* === Layout === */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-72 bg-[#001a0d]/60 border-r border-[#00ff99]/20 backdrop-blur-md shadow-[0_0_25px_#00ff9940]">
          <ChatSidebar onSelectUser={setSelectedUser} selectedUser={selectedUser} />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 ml-7 flex flex-col">
          {selectedUser ? (
            <div className="flex p-2 m-4 bg-[#001a0d]/60 border border-[#00ff99]/20 rounded-xl backdrop-blur-md shadow-[0_0_30px_#00ff9940]">
              <WebSocketChatBox peer={selectedUser} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-lg text-center">
                {/* Floating Icons */}
                <div className="relative mb-10 flex justify-center">
                  <Shield className="w-16 h-16 text-[#00ff99]/30 absolute animate-pulse" />
                  <Lock className="w-8 h-8 text-[#00ff99]/60 absolute -top-4 left-[30%] animate-float" />
                  <Cpu className="w-8 h-8 text-[#00ff99]/60 absolute bottom-0 right-[30%] animate-float-delayed" />
                  <Sparkles className="w-6 h-6 text-[#00ffcc]/60 absolute top-2 right-1/2 animate-float-delayed-2" />
                </div>

                {/* Message Card */}
                <div className="bg-[#001a0d]/70 border border-[#00ff99]/20 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_25px_#00ff9940] relative overflow-hidden">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#00ff99]/10 to-transparent animate-border-glow"></div>

                  <h2 className="text-3xl font-bold text-[#00ffcc] mb-4 drop-shadow-[0_0_15px_#00ff99]">
                    SECURE OPS TERMINAL
                  </h2>
                  <p className="text-[#00ff99cc] text-sm mb-6 leading-relaxed">
                    No contact selected. Choose an agent from the sidebar to initiate a classified channel.
                  </p>

                  <div className="space-y-3">
                    {[
                      "Post-Quantum Encryption Active",
                      "End-to-End Channel Verification",
                      "AI Threat Detection: ON",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center text-sm bg-[#002a15]/80 border border-[#00ff99]/10 rounded-lg py-2 hover:border-[#00ff99]/30 transition"
                      >
                        <div className="w-2 h-2 bg-[#00ff99] rounded-full mr-3 animate-pulse"></div>
                        <span className="text-[#00ffcc]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Status */}
                <div className="mt-8 flex justify-center gap-6 text-xs text-[#00ff99bb]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00ff99] rounded-full animate-pulse"></div>
                    SYSTEM ONLINE
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse delay-200"></div>
                    ENCRYPTION ACTIVE
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === Animations === */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes float-delayed-2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-4px) translateX(4px); }
        }

        @keyframes border-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }

        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite 2s; }
        .animate-float-delayed-2 { animation: float-delayed-2 5s ease-in-out infinite 1s; }
        .animate-border-glow { animation: border-glow 3s ease-in-out infinite; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #00ff99; border-radius: 4px; }
      `}</style>
    </div>
  );
}
