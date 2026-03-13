import React, { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Shield, User, Mail, Loader2, Cpu } from "lucide-react";
import { generateAndReturnPQKeys } from "../utils/crypto";

const API_URL = "https://localhost:8000/api/v1/auth"; 

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email) {
      toast.error("Please fill in both username and email.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      toast.info("Preparing secure registration...");
      const beginRes = await axios.post(`${API_URL}/register-begin`, {
        username,
        email,
      });

      toast.info("Touch your authenticator or use Face/Touch ID...");
      const attResp = await startRegistration(beginRes.data);

      const completeRes = await axios.post(`${API_URL}/register-complete`, {
        username,
        registration_response: attResp,
      });

      if (!completeRes.data.verified) {
        toast.error("WebAuthn verification failed.");
        setIsLoading(false);
        return;
      }

      toast.info("Generating post-quantum keys...");
      const pqKeys = await generateAndReturnPQKeys();

      localStorage.setItem("kyberPrivate", pqKeys.kyber.privateKey);
      localStorage.setItem("dilithiumPrivate", pqKeys.dilithium.privateKey);

      const regRes = await axios.post(`${API_URL}/register`, {
        username,
        email,
        kyberPublicKey: pqKeys.kyber.publicKey,
        dilithiumPublicKey: pqKeys.dilithium.publicKey,
      });

      toast.success(regRes.data.msg || "Registration complete!");
      if (regRes.data.invite_code) {
        toast.info(`Invite code: ${regRes.data.invite_code}`, { autoClose: 10000 });
      }

      toast.success("🎉 Welcome email sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = username && email && validateEmail(email);

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-200 text-slate-900 relative overflow-hidden flex items-center justify-center px-4 font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Light Tech Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,209,255,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(90deg,rgba(0,149,255,0.2)_1px,transparent_1px),linear-gradient(rgba(0,149,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Glass Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-200/20 rounded-full blur-[100px] animate-pulse" />
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

      {/* Registration Card */}
      <div className="relative z-20 cyber-glass p-8 md:p-12 w-full max-w-md rounded-none border-t-4 border-cyan-500 shadow-2xl">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-none transform rotate-45 shadow-sm">
            <Cpu className="w-8 h-8 text-cyan-600 transform -rotate-45" />
          </div>
          <div className="pt-2">
            <h1 className="text-2xl font-black tracking-[0.15em] text-slate-900 uppercase">
              ENLIST<span className="text-cyan-600">_IDENTITY</span>
            </h1>
            <div className="h-1 w-12 bg-cyan-500 mx-auto mt-2"></div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">
            Initialize PQC Lattice Enrollment
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <div className="group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2 group-focus-within:text-cyan-600">
              <User className="w-3 h-3" />
              Designation
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              placeholder="e.g., operator_01"
              className="w-full bg-white/50 border border-slate-200 rounded-none px-4 py-3 text-slate-900 font-mono text-sm placeholder-slate-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/10 outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {/* Email */}
          <div className="group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2 group-focus-within:text-cyan-600">
              <Mail className="w-3 h-3" />
              Comms_Channel
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="operator@network.xyz"
              className="w-full bg-white/50 border border-slate-200 rounded-none px-4 py-3 text-slate-900 font-mono text-sm placeholder-slate-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/10 outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-4 bg-slate-900 text-white font-black tracking-[0.2em] uppercase cyber-button-clip hover:bg-cyan-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                ENROLLING...
              </>
            ) : (
              "Initialize Enrollment"
            )}
          </button>
        </form>

        {/* Info Box */}
        {/* <div className="mt-8 bg-cyan-50/50 border-l-2 border-cyan-400 p-4 font-mono text-[10px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-cyan-700">SECURITY_NOTICE:</strong> Private keys (Kyber/Dilithium) are generated locally. Your browser vault acts as the hardware-root.
          </p>
        </div> */}

        <div className="text-center mt-6">
          <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
            Already cleared? <Link to="/login" className="text-cyan-600 hover:underline">Access Terminal</Link>
          </p>
        </div>
      </div>

      {/* Modern Status Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-4 bg-white/30 backdrop-blur-xl border-t border-white/80 flex flex-col md:flex-row justify-between items-center gap-4 z-30">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
            REG_NODE: ACTIVE
          </div>
          <div>VAULT: LOCAL_BROWSER</div>
        </div>
        <div className="text-[10px] font-black text-cyan-600/60 uppercase tracking-[0.2em]">
          Level Bravo Clearance Pending
        </div>
      </footer>
    </div>
  );
}