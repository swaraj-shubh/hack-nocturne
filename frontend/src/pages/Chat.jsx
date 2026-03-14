import { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import WebSocketChatBox from "../components/WebSocketChatBox";
import { useAuthStore } from "../context/useAuthStore";
import { useChatStore } from "../context/useChatStore";
import { Shield, Cpu, Lock, Sparkles, Loader2 } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuthStore();
  const { peer } = useChatStore();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (peer && !selectedUser) setSelectedUser(peer);
  }, [peer, selectedUser]);

  return (
    /* ADJUSTED: Industrial Theme Colors & Dynamic Height */
    <div className="h-[calc(100vh-70px)] bg-[#0a0a0a] text-orange-50 relative overflow-hidden font-sans selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* === Industrial Tech Background === */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,102,0,0.06)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,rgba(255,102,0,0.2)_1px,transparent_1px),linear-gradient(rgba(255,102,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Ember Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        .animate-scanline { animation: scanline 10s linear infinite; }
        .cyber-glass {
          background: rgba(20, 20, 20, 0.7);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 2px solid rgba(255, 102, 0, 0.2);
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ea580c; border-radius: 10px; }
      `}</style>

      {/* === Amber Scanline === */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
        <div className="w-full h-[1px] bg-orange-500/40 animate-scanline"></div>
      </div>

      {/* === Layout === */}
      <div className="relative z-20 flex h-full overflow-hidden">
        {/* Sidebar Panel */}
        <div className="w-80 cyber-glass border-r border-orange-900/30 shadow-2xl overflow-y-auto h-full">
          <ChatSidebar onSelectUser={setSelectedUser} selectedUser={selectedUser} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative h-full">
          {selectedUser ? (
            <div className="flex-1 flex flex-col p-4 h-full overflow-hidden">
              <div className="flex-1 cyber-glass border border-orange-900/20 rounded-none shadow-2xl relative overflow-hidden h-full">
                {/* Visual accent for active chat */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500 shadow-[0_0_15px_rgba(234,88,12,0.4)]" />
                <WebSocketChatBox peer={selectedUser} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 h-full">
              <div className="max-w-md w-full text-center">
                {/* Tech Visuals */}
                <div className="relative mb-12 flex justify-center">
                  <Shield className="w-20 h-20 text-orange-500/10 absolute animate-pulse scale-125" />
                  <div className="relative p-6 bg-[#0a0a0a] border border-orange-500/30 rotate-45 shadow-[0_0_20px_rgba(255,102,0,0.1)]">
                     <Lock className="w-8 h-8 text-orange-500 -rotate-45" />
                  </div>
                  <Cpu className="w-6 h-6 text-orange-900/40 absolute -bottom-6 right-1/4 animate-float" />
                  <Sparkles className="w-5 h-5 text-amber-600/40 absolute -top-4 left-1/4 animate-float" style={{animationDelay: '1s'}} />
                </div>

                {/* Information Card */}
                <div className="cyber-glass p-8 border-t-4 border-orange-600 shadow-2xl">
                  <h2 className="text-xl font-black tracking-[0.2em] text-white mb-4 uppercase italic">
                    OPS_TERMINAL <span className="text-orange-500">READY</span>
                  </h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
                    Awaiting peer selection. Initialize a secure PQC-encrypted channel from your contacts.
                  </p>

                  <div className="space-y-3">
                    {[
                      { label: "Lattice Encryption Active", icon: "🔐" },
                      { label: "Peer-to-Peer Verification", icon: "🤝" },
                      { label: "Zero-Knowledge Logs", icon: "📡" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 text-[10px] font-black tracking-widest bg-orange-950/20 border border-orange-900/30 rounded-none py-3 px-4 uppercase text-orange-400"
                      >
                        <span className="grayscale group-hover:grayscale-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-10 flex justify-center gap-8 text-[10px] font-black tracking-widest text-zinc-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse shadow-[0_0_8px_#ea580c]"></span>
                    CORE_ONLINE
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-75 shadow-[0_0_8px_#f59e0b]"></span>
                    SECURE_LINK_READY
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini System Footer */}
      <div className="fixed bottom-0 right-0 p-4 z-30 pointer-events-none">
        <div className="text-[10px] font-mono text-zinc-500 bg-[#0a0a0a]/80 backdrop-blur-sm px-3 py-1 border border-orange-900/30 uppercase tracking-tighter">
          Session Token: <span className="text-orange-500 font-bold">Valid_Auth</span>
        </div>
      </div>
    </div>
  );
}