import { useChatStore } from "../context/useChatStore";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  MessageCircle,
  Shield,
  Search,
  X,
  LogOut,
  Cpu,
  Lock,
  Network,
} from "lucide-react";

export default function ChatSidebar({ onSelectUser }) {
  const setPeer = useChatStore((state) => state.setPeer);
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get("/api/v1/user/connections", {
          withCredentials: true,
        });
        setConnections(res.data);
      } catch (err) {
        console.error("Failed to fetch connections", err);
      }
    };
    fetchConnections();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUserId(user.user_id);
    setPeer(user);
    onSelectUser(user);
  };

  const filteredConnections = connections.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="w-full h-[calc(100vh-70px)] bg-white/20 text-slate-900 relative overflow-hidden flex flex-col font-sans border-r border-slate-300 shadow-xl backdrop-blur-xl">
      {/* Light Tech Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(90deg,rgba(0,149,255,0.2)_1px,transparent_1px),linear-gradient(rgba(0,149,255,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Subtle Scanline */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-10">
        <div className="w-full h-[2px] bg-cyan-400 animate-[scanline_8s_linear_infinite]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-5 border-b border-slate-200/60 bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-none shadow-lg">
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="text-xs font-black tracking-[0.2em] text-slate-800 uppercase">
            SECURE<span className="text-cyan-600">_NODES</span>
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 p-4 border-b border-slate-200/40">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="FILTER CHANNELS..."
            className="w-full bg-white/60 border border-slate-200 text-slate-800 text-xs font-bold tracking-tight rounded-none py-2.5 pl-9 pr-8 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="relative z-10 px-5 py-2 bg-slate-50/50 border-b border-slate-200/40 flex justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
          <Network className="w-3 h-3 text-cyan-500" />
          <span>
            {filteredConnections.length} ACTIVE_LINK
            {filteredConnections.length !== 1 ? "S" : ""}
          </span>
        </div>
      </div>

      {/* Connections List */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 space-y-1">
        {filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-40">
            <Cpu className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-[10px] font-black tracking-tighter text-slate-600 uppercase">No Secure Links Found</p>
          </div>
        ) : (
          filteredConnections.map((user) => (
            <div
              key={user.user_id}
              onClick={() => handleSelectUser(user)}
              className={`group cursor-pointer p-4 transition-all duration-300 border-l-4 ${
                selectedUserId === user.user_id
                  ? "bg-white/80 border-cyan-500 shadow-md translate-x-1"
                  : "bg-transparent border-transparent hover:bg-white/40 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 flex items-center justify-center font-black text-xs transition-all duration-300 ${
                    selectedUserId === user.user_id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                  }`}
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3
                      className={`text-xs font-black tracking-tight uppercase truncate ${
                        selectedUserId === user.user_id
                          ? "text-slate-900"
                          : "text-slate-600 group-hover:text-slate-900"
                      }`}
                    >
                      {user.username}
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <Shield className="w-2.5 h-2.5 text-cyan-500/60" />
                    <span>PQC_LATTICE_ENCRYPTED</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-slate-200 p-4 bg-white/60 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          STABLE_NET
        </div>
        <button className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors uppercase">
          <LogOut className="w-3.5 h-3.5" />
          <span>Disconnect</span>
        </button>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(1000%); opacity: 0; }
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}