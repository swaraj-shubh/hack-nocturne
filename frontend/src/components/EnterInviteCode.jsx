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
    <div className="min-h-[calc(100vh-70px)] bg-slate-200 text-slate-900 relative overflow-hidden flex items-center justify-center px-4 font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Light Tech Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,209,255,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(90deg,rgba(0,149,255,0.2)_1px,transparent_1px),linear-gradient(rgba(0,149,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Glass Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-200/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <style>
        {`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .cyber-glass {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 32px 0 rgba(0, 149, 255, 0.05);
        }
        .cyber-button-clip {
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }
        `}
      </style>

      {/* Moving Scanline */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
        <div className="w-full h-[2px] bg-cyan-400/30 animate-scanline"></div>
      </div>

      {/* Card */}
      <div className="relative z-20 cyber-glass p-8 md:p-12 w-full max-w-md rounded-none border-t-4 border-cyan-500 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-none transform rotate-45 shadow-sm">
            <Lock className="w-8 h-8 text-cyan-600 transform -rotate-45" />
          </div>
          <div className="pt-2">
            <h1 className="text-2xl font-black tracking-[0.15em] text-slate-900 uppercase">
              LINK<span className="text-cyan-600">_ESTABLISHMENT</span>
            </h1>
            <div className="h-1 w-12 bg-cyan-500 mx-auto mt-2"></div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">
            Initialize P2P Handshake Protocol
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2 group-focus-within:text-cyan-600">
              <Key className="w-3 h-3" />
              Access_Token
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="EX: 9FJ-3A2Q-X7Z"
                className="w-full bg-white/50 border border-slate-200 rounded-none px-4 py-3 text-slate-900 font-mono text-lg tracking-widest placeholder-slate-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/10 outline-none transition-all"
                disabled={isLoading}
                required
              />
              {code && !isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
              )}
            </div>
            <p className="text-slate-400 text-[10px] mt-2 flex items-center gap-1 font-bold uppercase tracking-tighter">
              <Info className="w-3 h-3 text-cyan-500" />
              Required for encrypted channel clearing.
            </p>
          </div>

          {/* Loader Overlay for Button Context */}
          {isLoading && (
            <div className="bg-cyan-50/50 border border-cyan-100 p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <Loader2 className="w-4 h-4 text-cyan-600 animate-spin mr-2" />
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                  Negotiating Keys...
                </span>
              </div>
              <div className="flex items-center justify-center text-slate-400 text-[9px] font-bold uppercase tracking-tighter">
                <Shield className="w-3 h-3 mr-1.5 text-emerald-500" />
                Post-Quantum Handshake in Progress
              </div>
            </div>
          )}

          {/* Connect Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-4 bg-slate-900 text-white font-black tracking-[0.2em] uppercase cyber-button-clip hover:bg-cyan-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
        <div className="text-center mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => navigate("/chat")}
            className="text-slate-400 hover:text-cyan-600 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-3 h-3" />
            Return to Chats
          </button>
        </div>
      </div>

      {/* Modern Status Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-4 bg-white/30 backdrop-blur-xl border-t border-white/80 flex flex-col md:flex-row justify-between items-center gap-4 z-30">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
            NETWORK_STABLE
          </div>
          <div>PROTOCOL: KYBER_1024</div>
        </div>
        <div className="text-[10px] font-black text-cyan-600/60 uppercase tracking-[0.2em]">
          Auth Required for Channel Peering
        </div>
      </footer>
    </div>
  );
}