import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f7f9] text-slate-900 relative overflow-hidden font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Light Tech Background */}
      <div className="absolute inset-0 z-0">
        {/* Subtle radial tech glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,209,255,0.08)_0%,_transparent_50%)]" />
        
        {/* Soft Blue Grid - "The Blueprint" */}
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

      {/* Subtle Moving Scanline */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
        <div className="w-full h-[2px] bg-cyan-400/30 animate-scanline"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Main Title Area */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-cyan-50 border border-cyan-100 text-[10px] font-bold tracking-[0.3em] text-cyan-600 uppercase">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
            System Interface v4.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 uppercase">
            SECURE<span className="text-cyan-500 drop-shadow-[0_0_10px_rgba(0,209,255,0.3)]">OPS</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-slate-500 font-medium tracking-tight text-lg">
            High-integrity quantum-safe protocols for <span className="text-slate-800">defense-grade</span> infrastructure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-20">
          <Link to="/login">
            <Button className="h-14 px-10 bg-slate-900 text-white hover:bg-cyan-600 transition-all duration-300 cyber-button-clip rounded-none font-bold tracking-widest">
              INITIALIZE TERMINAL
            </Button>
          </Link>
          <Link to="#docs">
            <Button variant="outline" className="h-14 px-10 border-slate-200 bg-white/50 backdrop-blur-md text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300 cyber-button-clip rounded-none font-bold tracking-widest">
              VIEW_PROTOCOLS
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {[
            { title: "LATTICE_ENCRYPTION", desc: "NIST-standardized post-quantum key exchange layers.", icon: "🔐" },
            { title: "NEURAL_MONITOR", desc: "AI-driven behavioral analysis for zero-day mitigation.", icon: "🧠" },
            { title: "ROTATING_NODES", desc: "Dynamic session obfuscation via stealth mesh networking.", icon: "📡" },
          ].map((f, i) => (
            <Card key={f.title} className="cyber-glass group transition-all duration-500 hover:-translate-y-2 border-none">
              <CardContent className="p-8">
                <div className="text-3xl mb-4 opacity-80 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-sm font-black text-slate-800 mb-2 tracking-tighter">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-mono">
                  {f.desc}
                </p>
                <div className="mt-4 h-[1px] w-0 bg-cyan-400 group-hover:w-full transition-all duration-700"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modern Status Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-4 bg-white/30 backdrop-blur-xl border-t border-white/80 flex flex-col md:flex-row justify-between items-center gap-4 z-30">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
            CORE_STABLE
          </div>
          <div>ENCRYPTION: AES_256_GCM</div>
          <div className="hidden md:block">LOC: 127.0.0.1 // PORT: 8080</div>
        </div>
        
        <div className="text-[10px] font-black text-cyan-600/60 uppercase tracking-[0.2em]">
          Classified Access Only — Auth Required
        </div>
      </footer>
    </div>
  );
}