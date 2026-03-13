import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0a0a] text-orange-50 relative overflow-hidden flex items-center justify-center px-4 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Industrial Tech Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,102,0,0.06)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,rgba(255,102,0,0.2)_1px,transparent_1px),linear-gradient(rgba(255,102,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Ember Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
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

      {/* Login Card */}
      <div className="relative z-20 cyber-glass p-8 md:p-12 w-full max-w-md rounded-none border-t-4 border-orange-600 shadow-2xl">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-950/40 border border-orange-500/30 rounded-none transform rotate-45 shadow-sm">
            <Shield className="w-8 h-8 text-orange-500 transform -rotate-45" />
          </div>
          <div className="pt-2">
            <h1 className="text-2xl font-black tracking-[0.2em] text-white uppercase italic">
              ACCESS<span className="text-orange-500 italic">_TERMINAL</span>
            </h1>
            <div className="h-1 w-12 bg-orange-500 mx-auto mt-2"></div>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">
            Hardware Encryption Protocol Active
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-2 transition-colors group-focus-within:text-orange-300">
              <User className="w-3 h-3" />
              User_Callsign
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ENTER USERNAME..."
              className="w-full bg-[#0a0a0a]/60 border border-orange-900/30 rounded-none px-4 py-3 text-white font-mono text-sm placeholder-zinc-700 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!username || isLoading}
            className="w-full py-4 bg-orange-600 text-black font-black tracking-[0.2em] uppercase cyber-button-clip hover:bg-orange-500 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,102,0,0.2)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                VERIFYING...
              </>
            ) : (
              'Initialize Login'
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">
            NO ACCESS CREDENTIALS?{' '}
            <Link to="/register" className="text-orange-500 hover:text-orange-400 underline-offset-4 hover:underline transition-colors uppercase">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Industrial Status Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-4 bg-[#050505]/80 backdrop-blur-xl border-t border-orange-900/40 flex flex-col md:flex-row justify-between items-center gap-4 z-30">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full shadow-[0_0_8px_#ea580c]"></span>
            AUTH_SERVER: ONLINE
          </div>
          <div className="hidden md:block">MODE: PQC_HYBRID_AES</div>
        </div>
        <div className="text-[10px] font-black text-orange-600/40 uppercase tracking-[0.2em]">
          Classified Access Only — Auth Required
        </div>
      </footer>
    </div>
  );
}