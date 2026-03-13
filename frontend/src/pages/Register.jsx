import React, { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import axios from "axios";
import { toast } from "react-toastify";
import { Shield, User, Mail } from "lucide-react";
import { generateAndReturnPQKeys } from "../utils/crypto"; // your PQ keygen util

const API_URL = "https://localhost:8000/api/v1/auth"; // adjust backend URL

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
    <div className="min-h-screen bg-black text-[#00ff99] relative overflow-hidden flex items-center justify-center px-4">
      {/* Neon grid background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,255,100,0.05)_0%,_black_80%)]"></div>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(0,255,100,0.2)_1px,transparent_1px),linear-gradient(rgba(0,255,100,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes flicker {
            0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; }
            20%, 24%, 55% { opacity: 0.4; }
          }
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}
      </style>

      {/* Scanning line */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="w-full h-1 bg-[#00ff99]/20 animate-[scan_4s_linear_infinite]"></div>
      </div>

      {/* Registration Card */}
      <div className="relative z-10 bg-[#001a0d]/60 border border-[#00ff99]/20 rounded-2xl shadow-[0_0_30px_#00ff9940] backdrop-blur-md p-8 w-full max-w-md">
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00ff99]/20 rounded-full shadow-[0_0_20px_#00ff99a0]">
            <Shield className="w-8 h-8 text-[#00ff99]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-widest text-[#00ff99] drop-shadow-[0_0_15px_#00ff99] animate-[flicker_2s_infinite]">
            ENLISTMENT PORTAL
          </h1>
          <p className="text-sm text-[#00ff99aa] font-mono">
            Quantum-Safe Identity Enrollment
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-sm font-mono text-[#00ff99bb] flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-[#00ff99]" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              placeholder="e.g., neo_the_one"
              className="w-full bg-black/40 border border-[#00ff99]/30 rounded-md px-3 py-2 text-[#00ffcc] font-mono placeholder-[#00ff9966] focus:ring-2 focus:ring-[#00ff99] focus:border-[#00ff99] outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-mono text-[#00ff99bb] flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-[#00ff99]" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="e.g., neo@matrix.com"
              className="w-full bg-black/40 border border-[#00ff99]/30 rounded-md px-3 py-2 text-[#00ffcc] font-mono placeholder-[#00ff9966] focus:ring-2 focus:ring-[#00ff99] focus:border-[#00ff99] outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-2.5 mt-2 rounded-md font-semibold text-black bg-[#00ff99] hover:bg-[#00e688] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_#00ff99] disabled:bg-[#00ff9940] disabled:text-[#00331f] flex items-center justify-center"
          >
            {isLoading ? "Registering..." : "Create Secure Identity"}
          </button>
        </form>

        {/* Info box */}
        <div className="mt-6 bg-[#00331f]/60 border border-[#00ff99]/20 rounded-lg p-3 font-mono text-xs text-[#00ffcc]">
          <p>
            <strong className="text-[#00ff99]">Note:</strong> Your private keys remain securely in your browser vault and are never transmitted.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-xs text-[#00ff99aa] font-mono border-t border-[#00ff99]/10">
        [ REGISTRATION NODE: ACTIVE ] • Encryption: PQC Lattice Hybrid • Clearance Level: BRAVO
      </footer>
    </div>
  );
}
