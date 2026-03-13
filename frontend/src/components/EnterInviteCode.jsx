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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#001a00] to-black text-green-400 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,255,0,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.15)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute -top-32 -right-32 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-2xl"></div>

      {/* Card */}
      <div className="relative z-10 bg-black/70 border border-green-500/30 shadow-[0_0_50px_#00ff8080] rounded-2xl p-10 w-full max-w-md space-y-8 backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl shadow-[0_0_25px_#00ff8050] animate-pulse">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200 drop-shadow-[0_0_10px_#00ff80]">
            Secure Channel Access
          </h1>
          <p className="text-green-300/80 text-sm">
            Enter your <span className="font-semibold text-emerald-400">invite code</span> to establish a quantum-safe link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invite Code Field */}
          <div className="space-y-2">
            <label className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Invite Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ex: 9FJ-3A2Q-X7Z"
                className={`w-full bg-black/40 border rounded-lg px-4 py-3 text-green-100 font-mono tracking-wide text-lg outline-none transition-all duration-300 ${
                  code
                    ? "border-green-500/70 focus:ring-2 focus:ring-green-400 focus:border-green-400"
                    : "border-green-700/40 hover:border-green-500/60 focus:ring-2 focus:ring-green-400"
                }`}
                disabled={isLoading}
                required
              />
              {code && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              )}
            </div>
            <p className="text-green-300/70 text-xs mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Get the code from your teammate securely.
            </p>
          </div>

          {/* Loader */}
          {isLoading && (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-400/40 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                <Loader2 className="w-6 h-6 text-green-400 animate-spin mr-3" />
                <span className="text-green-300 font-semibold text-lg">
                  Establishing Secure Link...
                </span>
              </div>
              <div className="flex items-center justify-center text-green-200/70 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                Initiating Post-Quantum Encryption Handshake
              </div>
            </div>
          )}

          {/* Connect Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 mt-4 rounded-lg font-bold tracking-wider transition-all duration-300 transform ${
              !isFormValid || isLoading
                ? "bg-green-800/30 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-green-600 to-emerald-500 hover:scale-[1.03] hover:shadow-[0_0_25px_#00ff8050] text-white"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                Connecting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                Connect Securely
              </div>
            )}
          </button>
        </form>

        {/* Back Button */}
        <div className="text-center mt-6 pt-6 border-t border-green-700/30">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-green-300 hover:text-emerald-400 transition-colors font-medium hover:underline text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}