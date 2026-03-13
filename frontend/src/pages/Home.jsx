import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-orange-50 relative overflow-hidden font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Dark Industrial Background */}
      <div className="absolute inset-0 z-0">
        {/* Deep Orange radial tech glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,102,0,0.06)_0%,_transparent_60%)]" />
        
        {/* Amber Grid - "The Hardware Blueprint" */}
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
          border: 1px solid rgba(255, 72, 0, 0.63);
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

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Main Title Area */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-orange-950/40 border border-orange-500/30 text-[10px] font-bold tracking-[0.4em] text-orange-400 uppercase">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
            Hardware Protocol v4.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
            SECURE<span className="text-orange-500 drop-shadow-[0_0_15px_rgba(255,102,0,0.5)]">OPS</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-zinc-400 font-medium tracking-tight text-lg">
            Stealth-mode quantum encryption for <span className="text-orange-400">high-risk</span> intelligence nodes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-20">
          <Link to="/login">
            <Button className="h-14 px-12 bg-orange-600 text-black hover:bg-orange-500 transition-all duration-300 cyber-button-clip rounded-none font-black tracking-widest text-sm shadow-[0_0_20px_rgba(255,102,0,0.3)]">
              INITIALIZE TERMINAL
            </Button>
          </Link>
          <Link to="#docs">
            <Button variant="outline" className="h-14 px-12 border-orange-500/40 bg-transparent backdrop-blur-md text-orange-500 hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300 cyber-button-clip rounded-none font-black tracking-widest text-sm">
              VIEW_PROTOCOLS
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {[
            { title: "LATTICE_CORE", desc: "Hardened key-exchange modules resistant to brute-force decryption.", icon: "🔐" },
            { title: "KINETIC_MONITOR", desc: "Real-time threat mitigation and adaptive signal scrambling.", icon: "🧠" },
            { title: "DARK_MESH", desc: "Non-attributable routing layers across rotating session IDs.", icon: "📡" },
            { title: "DARK_MESH", desc: "Non-attributable routing layers across rotating session IDs.", icon: "📡" },
            { title: "DARK_MESH", desc: "Non-attributable routing layers across rotating session IDs.", icon: "📡" },
            { title: "DARK_MESH", desc: "Non-attributable routing layers across rotating session IDs.", icon: "📡" },
            { title: "DARK_MESH", desc: "Non-attributable routing layers across rotating session IDs.", icon: "📡" },
          ].map((f, i) => (
            <Card key={f.title} className="cyber-glass group transition-all duration-500 hover:-translate-y-2 border-none">
              <CardContent className="p-8">
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">{f.icon}</div>
                <h3 className="text-sm font-black text-orange-400 mb-2 tracking-[0.1em]">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  {f.desc}
                </p>
                <div className="mt-4 h-[1px] w-0 bg-orange-500 group-hover:w-full transition-all duration-700"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Industrial Status Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-4 bg-[#050505]/80 backdrop-blur-xl border-t border-orange-900/40 flex flex-col md:flex-row justify-between items-center gap-4 z-30 font-mono">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full shadow-[0_0_8px_#ea580c]"></span>
            SIGNAL: STABLE
          </div>
          <div className="text-orange-900/60">ENCRYPTION: PQC_ACTIVE</div>
          <div className="hidden md:block text-orange-900/40">NODE: 0x25FF1A</div>
        </div>
        
        <div className="text-[10px] font-black text-orange-600/40 uppercase tracking-[0.3em]">
          Classified Access — System Log 102.4
        </div>
      </footer>
    </div>
  );
}