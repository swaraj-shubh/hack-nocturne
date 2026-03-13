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
    <div className="min-h-screen bg-slate-200 text-slate-900 relative overflow-hidden flex items-center justify-center px-4 font-sans selection:bg-cyan-100 selection:text-cyan-900">
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

      {/* Login Card */}
      <div className="relative z-20 cyber-glass p-8 md:p-12 w-full max-w-md rounded-none border-t-4 border-cyan-500 shadow-2xl">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-none transform rotate-45 shadow-sm">
            <Shield className="w-8 h-8 text-cyan-600 transform -rotate-45" />
          </div>
          <div className="pt-2">
            <h1 className="text-2xl font-black tracking-[0.2em] text-slate-900 uppercase">
              ACCESS<span className="text-cyan-600">_TERMINAL</span>
            </h1>
            <div className="h-1 w-12 bg-cyan-500 mx-auto mt-2"></div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">
            Hardware Encryption Protocol Active
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2 transition-colors group-focus-within:text-cyan-600">
              <User className="w-3 h-3" />
              User_Callsign
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ENTER USERNAME..."
              className="w-full bg-white/50 border border-slate-200 rounded-none px-4 py-3 text-slate-900 font-mono text-sm placeholder-slate-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/10 outline-none transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!username || isLoading}
            className="w-full py-4 bg-slate-900 text-white font-black tracking-[0.2em] uppercase cyber-button-clip hover:bg-cyan-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
          <p className="text-slate-400 text-[10px] font-bold tracking-widest">
            NO ACCESS CREDENTIALS?{' '}
            <Link to="/register" className="text-cyan-600 hover:text-cyan-700 underline-offset-4 hover:underline transition-colors uppercase">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Modern Status Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-4 bg-white/30 backdrop-blur-xl border-t border-white/80 flex flex-col md:flex-row justify-between items-center gap-4 z-30">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
            AUTH_SERVER: ONLINE
          </div>
          <div className="hidden md:block">MODE: PQC_HYBRID_AES</div>
        </div>
        <div className="text-[10px] font-black text-cyan-600/60 uppercase tracking-[0.2em]">
          Classified Access Only — Auth Required
        </div>
      </footer>
    </div>
  );
}
