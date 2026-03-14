import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../context/useChatStore";
import {
  Shield,
  Key,
  Loader2,
  ArrowLeft,
  Zap,
  Info,
  CheckCircle,
  Lock,
} from "lucide-react";

export default function EnterInviteCode() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setPeer = useChatStore((state) => state.setPeer);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Please enter a valid invite code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "/api/v1/user/connect",
        { invite_code: code },
        { withCredentials: true }
      );

      const connectedUser = res.data.connected_user;
      setPeer(connectedUser);
      toast.success(`Connected securely to ${connectedUser.username}! ⚡`);
      navigate("/chat");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Invalid or expired invite code");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = code.trim().length > 0;

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0a0a] text-orange-50 relative overflow-hidden flex items-center justify-center px-4 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Industrial Tech Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,102,0,0.06)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,rgba(255,102,0,0.2)_1px,transparent_1px),linear-gradient(rgba(255,102,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Ember Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-amber-700/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <style>
        {`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        .animate-scanline {
          animation: scanline 10s linear infinite;
        }
        .cyber-glass {
          background: rgba(20, 20, 20, 0.7);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 2px solid rgba(255, 102, 0, 0.3);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }
        .cyber-button-clip {
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }
        `}
      </style>

      {/* Amber Scanline */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
        <div className="w-full h-[1px] bg-orange-500/40 animate-scanline"></div>
      </div>

      {/* Card */}
      <div className="relative z-20 cyber-glass p-8 md:p-12 w-full max-w-md rounded-none border-t-4 border-orange-600 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-950/40 border border-orange-500/30 rounded-none transform rotate-45 shadow-sm">
            <Lock className="w-8 h-8 text-orange-500 transform -rotate-45" />
          </div>
          <div className="pt-2">
            <h1 className="text-2xl font-black tracking-[0.15em] text-white uppercase italic">
              LINK<span className="text-orange-500 italic">_ESTABLISHMENT</span>
            </h1>
            <div className="h-1 w-12 bg-orange-500 mx-auto mt-2"></div>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">
            Initialize P2P Handshake Protocol
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-2 group-focus-within:text-orange-300">
              <Key className="w-3 h-3" />
              Access_Token
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="EX: 9FJ-3A2Q-X7Z"
                className="w-full bg-[#0a0a0a]/60 border border-orange-900/30 rounded-none px-4 py-3 text-white font-mono text-lg tracking-widest placeholder-zinc-700 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 outline-none transition-all"
                disabled={isLoading}
                required
              />
              {code && !isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                </div>
              )}
            </div>
            <p className="text-zinc-500 text-[10px] mt-2 flex items-center gap-1 font-bold uppercase tracking-tighter">
              <Info className="w-3 h-3 text-orange-500" />
              Required for encrypted channel clearing.
            </p>
          </div>

          {/* Loader Overlay for Button Context */}
          {isLoading && (
            <div className="bg-orange-950/40 border border-orange-500/30 p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <Loader2 className="w-4 h-4 text-orange-500 animate-spin mr-2" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Negotiating Keys...
                </span>
              </div>
              <div className="flex items-center justify-center text-zinc-400 text-[9px] font-bold uppercase tracking-tighter">
                <Shield className="w-3 h-3 mr-1.5 text-orange-600" />
                Post-Quantum Handshake in Progress
              </div>
            </div>
          )}

          {/* Connect Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-4 bg-orange-600 text-black font-black tracking-[0.2em] uppercase cyber-button-clip hover:bg-orange-500 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,102,0,0.2)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                CONNECTING...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Secure Link
              </>
            )}
          </button>
        </form>

        {/* Footer / Navigation */}
        <div className="text-center mt-8 pt-6 border-t border-orange-900/20">
          <button
            onClick={() => navigate("/chat")}
            className="text-zinc-500 hover:text-orange-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 mx-auto active:scale-95"
          >
            <ArrowLeft className="w-3 h-3" />
            Return to Chats
          </button>
        </div>
      </div>

      {/* Industrial Status Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-4 bg-[#050505]/80 backdrop-blur-xl border-t border-orange-900/40 flex flex-col md:flex-row justify-between items-center gap-4 z-30 font-mono">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full shadow-[0_0_8px_#ea580c]"></span>
            NETWORK_STABLE
          </div>
          <div className="text-orange-900/60">PROTOCOL: KYBER_1024</div>
        </div>
        <div className="text-[10px] font-black text-orange-600/40 uppercase tracking-[0.3em]">
          Auth Required for Channel Peering
        </div>
      </footer>
    </div>
  );
}