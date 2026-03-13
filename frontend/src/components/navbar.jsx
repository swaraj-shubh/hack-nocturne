import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';
import { toast } from 'react-toastify';
import axios from 'axios';

// SVG Icons
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
const TerminalIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
        <div className={`flex items-center space-x-2 px-4 py-2 text-[10px] font-black tracking-widest transition-all duration-300 border-b-2 ${
          isActive 
            ? 'border-orange-500 text-orange-500 bg-orange-500/10' 
            : 'border-transparent text-zinc-500 hover:text-orange-400 hover:bg-orange-500/5'
        }`}>
          {icon && <span className={isActive ? 'text-orange-500' : 'text-zinc-600 group-hover:text-orange-500'}>{icon}</span>}
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
          ? "bg-orange-600 text-black hover:bg-orange-500 shadow-lg shadow-orange-900/20"
          : "border border-orange-500/40 bg-transparent text-orange-500 hover:bg-orange-500 hover:text-black"
      }`}
    >
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );

  return (
    <>
      {/* UPDATED: Changed bg-[#0a0a0a]/80 to bg-[#0a0a0a] to match Home page exactly */}
<nav className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-orange-500/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-orange-600 rounded-none flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                  <img src="/vite.png" alt="Logo" className='w-5 h-5 invert transition-transform duration-500 group-hover:rotate-90' />
                </div>
              </div>
              <span className="text-sm font-black tracking-tighter text-white uppercase italic">
                HACK<span className="text-orange-500">NOCTURNE</span>
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/playground" icon={<TerminalIcon className="w-4 h-4" />}>
                PLAYGROUND
              </NavLink>

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
                  <div className="bg-orange-950/20 border border-orange-900/30 rounded-none px-3 py-1.5 flex items-center space-x-3 shadow-sm">
                    <div className="relative">
                      <div className="w-7 h-7 bg-orange-600 text-black text-[10px] font-black flex items-center justify-center">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-orange-400 border border-black rounded-full animate-pulse"></span>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-white leading-none mb-1 uppercase tracking-tighter">
                        {user.username}
                      </div>
                      <div className="text-[9px] text-orange-500 font-bold tracking-widest uppercase">
                        ID: {user.invite_code || '---'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-zinc-600 hover:text-orange-500 transition-colors"
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
              className="md:hidden p-2 text-orange-500 hover:bg-orange-500/10 rounded-none transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden bg-[#0a0a0a] border-b border-orange-900/30 ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-6 space-y-4">
            <NavLink to="/playground" icon={<TerminalIcon className="w-4 h-4" />}>PLAYGROUND</NavLink>
            {user && (
              <>
                <NavLink to="/chat" icon={<MessageCircle className="w-4 h-4" />}>SECURE_CHAT</NavLink>
                <NavLink to="/invite" icon={<LinkIcon className="w-4 h-4" />}>CONNECT_NODE</NavLink>
                
                <div className="p-4 bg-orange-950/20 border border-orange-900/30 space-y-4">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-600 text-black flex items-center justify-center font-black">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs font-bold text-white uppercase tracking-widest">
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