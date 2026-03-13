import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../context/useAuthStore';
import { Shield, User, Loader2 } from 'lucide-react';
import { base64urlToBuffer, bufferToBase64url } from '../utils/base64';

export default function Login() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter your username.');
      return;
    }

    setIsLoading(true);
    try {
      const beginToast = toast.info('Requesting secure challenge...');
      const beginRes = await axios.post(
        '/api/v1/auth/login-begin',
        { username: username.trim().toLowerCase() },
        { withCredentials: true }
      );
      const options = beginRes.data;
      options.challenge = base64urlToBuffer(options.challenge);
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred) => ({
          ...cred,
          id: base64urlToBuffer(cred.id),
        }));
      }

      toast.update(beginToast, { render: 'Please use your authenticator (e.g., PIN, fingerprint)...' });
      const credential = await navigator.credentials.get({ publicKey: options });

      const authResponse = {
        id: credential.id,
        rawId: bufferToBase64url(credential.rawId),
        type: credential.type,
        response: {
          authenticatorData: bufferToBase64url(credential.response.authenticatorData),
          clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
          signature: bufferToBase64url(credential.response.signature),
          userHandle: credential.response.userHandle
            ? bufferToBase64url(credential.response.userHandle)
            : null,
        },
      };

      toast.update(beginToast, { render: 'Verifying your identity...', type: 'info', isLoading: true });
      const verifyRes = await axios.post(
        '/api/v1/auth/login-complete',
        {
          username: username.trim().toLowerCase(),
          authentication_response: authResponse,
        },
        { withCredentials: true }
      );

      if (verifyRes.data?.success && verifyRes.data?.user) {
        toast.update(beginToast, { render: 'Login successful! Welcome back.', type: 'success', isLoading: false, autoClose: 3000 });
        setUser(verifyRes.data.user);
        navigate('/chat');
      } else {
        throw new Error(verifyRes.data?.msg || 'Authentication failed.');
      }
    } catch (err) {
      console.error("Login Error:", err);
      let errorMessage = err.response?.data?.detail || err.message || 'An unknown error occurred.';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Authentication was cancelled. Please try again.';
      }
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Login card */}
      <div className="relative z-10 bg-[#001a0d]/60 border border-[#00ff99]/20 rounded-2xl shadow-[0_0_30px_#00ff9940] backdrop-blur-md p-8 w-full max-w-md">
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00ff99]/20 rounded-full shadow-[0_0_20px_#00ff99a0]">
            <Shield className="w-8 h-8 text-[#00ff99]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-widest text-[#00ff99] drop-shadow-[0_0_15px_#00ff99] animate-[flicker_2s_infinite]">
            ACCESS TERMINAL
          </h1>
          <p className="text-sm text-[#00ff99aa] font-mono">
            Authenticate using secure hardware token
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-mono text-[#00ff99bb] flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-[#00ff99]" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your call-sign"
              className="w-full bg-black/40 border border-[#00ff99]/30 rounded-md px-3 py-2 text-[#00ffcc] font-mono placeholder-[#00ff9966] focus:ring-2 focus:ring-[#00ff99] focus:border-[#00ff99] outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!username || isLoading}
            className="w-full py-2.5 mt-2 rounded-md font-semibold text-black bg-[#00ff99] hover:bg-[#00e688] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_#00ff99] flex items-center justify-center disabled:bg-[#00ff9940] disabled:text-[#00331f]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Login with Secure Key'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[#00ff99aa] text-sm font-mono">
            No access credentials?{' '}
            <a href="/register" className="text-[#00ffcc] hover:underline hover:text-[#00ff99] transition">
              Request clearance
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-xs text-[#00ff99aa] font-mono border-t border-[#00ff99]/10">
        [ AUTH SERVER: ACTIVE ] • Encryption: PQC Hybrid AES-4096 • Clearance Level: ALPHA
      </footer>
    </div>
  );
}
