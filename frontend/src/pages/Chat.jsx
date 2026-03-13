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
    /* ADJUSTED: Changed min-h to fixed h and matched the calc to your navbar height */
    <div className="h-[calc(100vh-70px)] bg-slate-200 text-slate-900 relative overflow-hidden font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* === Light Tech Background === */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,209,255,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(90deg,rgba(0,149,255,0.2)_1px,transparent_1px),linear-gradient(rgba(0,149,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        .animate-scanline { animation: scanline 8s linear infinite; }
        .cyber-glass {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.7);
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 10px; }
      `}</style>

      {/* === Moving Scanline === */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
        <div className="w-full h-[2px] bg-cyan-400/30 animate-scanline"></div>
      </div>

      {/* === Layout === */}
      {/* ADJUSTED: Changed h-screen to h-full so it respects the calc parent height */}
      <div className="relative z-20 flex h-full overflow-hidden">
        {/* Sidebar Panel */}
        {/* ADJUSTED: Added h-full to ensure internal scroll works correctly */}
        <div className="w-80 cyber-glass border-r border-slate-300 shadow-xl overflow-y-auto h-full">
          <ChatSidebar onSelectUser={setSelectedUser} selectedUser={selectedUser} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative h-full">
          {selectedUser ? (
            /* ADJUSTED: Added h-full and overflow-hidden to contain the WebSocketChatBox */
            <div className="flex-1 flex flex-col p-4 h-full overflow-hidden">
              <div className="flex-1 cyber-glass border border-white/80 rounded-none shadow-2xl relative overflow-hidden h-full">
                {/* Visual accent for active chat */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <WebSocketChatBox peer={selectedUser} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 h-full">
              <div className="max-w-md w-full text-center">
                {/* Tech Visuals */}
                <div className="relative mb-12 flex justify-center">
                  <Shield className="w-20 h-20 text-cyan-500/10 absolute animate-pulse scale-125" />
                  <div className="relative p-6 bg-white border border-slate-200 rotate-45 shadow-lg">
                     <Lock className="w-8 h-8 text-cyan-600 -rotate-45" />
                  </div>
                  <Cpu className="w-6 h-6 text-slate-400 absolute -bottom-6 right-1/4 animate-float" />
                  <Sparkles className="w-5 h-5 text-purple-400 absolute -top-4 left-1/4 animate-float" style={{animationDelay: '1s'}} />
                </div>

                {/* Information Card */}
                <div className="cyber-glass p-8 border-t-4 border-cyan-500 shadow-xl">
                  <h2 className="text-xl font-black tracking-[0.2em] text-slate-900 mb-4 uppercase">
                    OPS_TERMINAL <span className="text-cyan-600">READY</span>
                  </h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
                    Awaiting peer selection. Initialize a secure PQC-encrypted channel from your contacts.
                  </p>

                  <div className="space-y-3">
                    {[
                      { label: "Lattice Encryption Active", icon: "💎" },
                      { label: "Peer-to-Peer Verification", icon: "🤝" },
                      { label: "Zero-Knowledge Logs", icon: "👻" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 text-[10px] font-black tracking-widest bg-white/60 border border-slate-100 rounded-none py-3 px-4 uppercase text-slate-600"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-10 flex justify-center gap-8 text-[10px] font-black tracking-widest text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                    CORE_ONLINE
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-75"></span>
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
        <div className="text-[10px] font-mono text-slate-400 bg-white/50 backdrop-blur-sm px-3 py-1 border border-slate-200 uppercase tracking-tighter">
          Session Token: <span className="text-cyan-600 font-bold">Valid_Auth</span>
        </div>
      </div>
    </div>
  );
}