import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';
import { toast } from 'react-toastify';
import axios from 'axios';

// Keeping your SVG Icons as they were...
const MessageCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const LogOut = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const LinkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
const Menu = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/');
    }
  };

  const NavLink = ({ to, children, icon, className = "" }) => {
    const isActive = location.pathname === to;
    return (
      <div
        className={`relative group cursor-pointer ${className}`}
        onClick={() => { navigate(to); setIsMobileMenuOpen(false); }}
      >
        <div className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold tracking-widest transition-all duration-300 border-b-2 ${
          isActive 
            ? 'border-cyan-500 text-slate-900 bg-cyan-50/50' 
            : 'border-transparent text-slate-500 hover:text-cyan-600 hover:bg-white/50'
        }`}>
          {icon && <span className={isActive ? 'text-cyan-600' : 'text-slate-400'}>{icon}</span>}
          <span className="uppercase">{children}</span>
        </div>
      </div>
    );
  };

  const AuthButton = ({ onClick, children, variant = "primary", icon }) => (
    <button
      onClick={onClick}
      style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
      className={`group relative flex items-center space-x-2 px-6 py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 transform active:scale-95 ${
        variant === "primary"
          ? "bg-slate-900 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-100"
          : "border border-slate-400/70 bg-white/80 text-slate-600 hover:border-cyan-400 hover:text-cyan-600"
      }`}
    >
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <img src="/vite.png" alt="Logo" className='w-8 h-8 transition-transform duration-500 group-hover:rotate-90' />
                <div className="absolute -inset-1 bg-cyan-400/20 blur-md rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
              </div>
              <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">
                HACK<span className="text-cyan-500">NOCTURNE</span>
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-2">
              {user && (
                <>
                  <NavLink to="/chat" icon={<MessageCircle className="w-4 h-4" />}>
                    SECURE_CHAT
                  </NavLink>
                  <NavLink to="/invite" icon={<LinkIcon className="w-4 h-4" />}>
                    CONNECT_NODE
                  </NavLink>
                </>
              )}
            </div>

            {/* Right Side Auth / Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <>
                  <AuthButton onClick={() => navigate('/register')} variant="secondary">
                    Register
                  </AuthButton>
                  <AuthButton onClick={() => navigate('/login')}>
                    Login
                  </AuthButton>
                </>
              ) : (
                <>
                  <div className="bg-white/60 border border-white/80 rounded-sm px-3 py-1.5 flex items-center space-x-3 shadow-sm">
                    <div className="relative">
                      <div className="w-7 h-7 bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full animate-pulse"></span>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-900 leading-none mb-1">
                        {user.username}
                      </div>
                      <div className="text-[9px] text-cyan-600 font-bold tracking-widest uppercase">
                        ID: {user.invite_code || '---'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Terminate Session"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-cyan-50 rounded-none transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white/95 backdrop-blur-2xl border-b border-slate-100 ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-6 space-y-4">
            {user && (
              <>
                <NavLink to="/chat" icon={<MessageCircle className="w-4 h-4" />}>SECURE_CHAT</NavLink>
                <NavLink to="/invite" icon={<LinkIcon className="w-4 h-4" />}>CONNECT_NODE</NavLink>
                
                <div className="p-4 bg-slate-50 border border-slate-100 space-y-4">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                        {user.username}
                      </div>
                   </div>
                   <AuthButton onClick={handleLogout} variant="secondary" className="w-full justify-center">
                      Terminate Session
                   </AuthButton>
                </div>
              </>
            )}

            {!user && (
              <div className="flex flex-col gap-3">
                <AuthButton onClick={() => navigate('/register')} variant="secondary">Register</AuthButton>
                <AuthButton onClick={() => navigate('/login')}>Login</AuthButton>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
