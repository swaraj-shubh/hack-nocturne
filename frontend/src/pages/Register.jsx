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

      {/* Registration Card */}
      <div className="relative z-20 cyber-glass p-8 md:p-12 w-full max-w-md rounded-none border-t-4 border-orange-600 shadow-2xl">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-950/40 border border-orange-500/30 rounded-none transform rotate-45 shadow-sm">
            <Cpu className="w-8 h-8 text-orange-500 transform -rotate-45" />
          </div>
          <div className="pt-2">
            <h1 className="text-2xl font-black tracking-[0.15em] text-white uppercase italic">
              ENLIST<span className="text-orange-600">_IDENTITY</span>
            </h1>
            <div className="h-1 w-12 bg-orange-600 mx-auto mt-2"></div>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">
            Initialize PQC Lattice Enrollment
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <div className="group">
            <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-2 group-focus-within:text-orange-300">
              <User className="w-3 h-3" />
              Designation
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              placeholder="e.g., operator_01"
              className="w-full bg-[#0a0a0a]/60 border border-orange-900/30 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-zinc-700 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {/* Email */}
          <div className="group">
            <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-2 group-focus-within:text-orange-300">
              <Mail className="w-3 h-3" />
              Comms_Channel
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="operator@network.xyz"
              className="w-full bg-[#0a0a0a]/60 border border-orange-900/30 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-zinc-700 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-4 bg-orange-600 text-black font-black tracking-[0.2em] uppercase cyber-button-clip hover:bg-orange-500 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,102,0,0.2)]"
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

        <div className="text-center mt-8">
          <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">
            Already cleared? <Link to="/login" className="text-orange-500 hover:text-orange-400 hover:underline">Access Terminal</Link>
          </p>
        </div>
      </div>

      {/* Industrial Status Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-4 bg-[#050505]/80 backdrop-blur-xl border-t border-orange-900/40 flex flex-col md:flex-row justify-between items-center gap-4 z-30">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full shadow-[0_0_8px_#ea580c]"></span>
            REG_NODE: ACTIVE
          </div>
          <div>VAULT: LOCAL_BROWSER</div>
        </div>
        <div className="text-[10px] font-black text-orange-600/40 uppercase tracking-[0.2em]">
          Level Bravo Clearance Pending
        </div>
      </footer>
    </div>
  );
}