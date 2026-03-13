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
    <div className="w-full h-full bg-[#0a0a0a] text-orange-50 relative overflow-hidden flex flex-col font-sans border-r border-orange-900/30 shadow-2xl">
      {/* Industrial Tech Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,rgba(255,102,0,0.2)_1px,transparent_1px),linear-gradient(rgba(255,102,0,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Amber Scanline */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div className="w-full h-[1px] bg-orange-500/40 animate-[scanline_10s_linear_infinite]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-5 border-b border-orange-900/40 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 flex items-center justify-center rounded-none shadow-[0_0_15px_rgba(234,88,12,0.3)]">
            <Lock className="w-4 h-4 text-black" />
          </div>
          <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase italic">
            SECURE<span className="text-orange-500 italic">_NODES</span>
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 p-4 border-b border-orange-900/20">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="FILTER CHANNELS..."
            className="w-full bg-[#111]/60 border border-orange-900/30 text-white text-xs font-bold tracking-tight rounded-none py-2.5 pl-9 pr-8 placeholder-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all font-mono"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-zinc-600 hover:text-orange-500 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="relative z-10 px-5 py-2 bg-orange-950/10 border-b border-orange-900/20 flex justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
          <Network className="w-3 h-3 text-orange-600" />
          <span>
            {filteredConnections.length} ACTIVE_LINK
            {filteredConnections.length !== 1 ? "S" : ""}
          </span>
        </div>
      </div>

      {/* Connections List */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 space-y-1">
        {filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
            <Cpu className="w-10 h-10 text-zinc-700 mb-3" />
            <p className="text-[10px] font-black tracking-tighter text-zinc-600 uppercase">No Secure Links Found</p>
          </div>
        ) : (
          filteredConnections.map((user) => (
            <div
              key={user.user_id}
              onClick={() => handleSelectUser(user)}
              className={`group cursor-pointer p-4 transition-all duration-300 border-l-2 ${
                selectedUserId === user.user_id
                  ? "bg-orange-950/20 border-orange-500 shadow-[inset_0_0_20px_rgba(234,88,12,0.05)] translate-x-1"
                  : "bg-transparent border-transparent hover:bg-zinc-900/40 hover:border-orange-900/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 flex items-center justify-center font-black text-xs transition-all duration-300 ${
                    selectedUserId === user.user_id
                      ? "bg-orange-600 text-black shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                      : "bg-zinc-900 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-orange-400"
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
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-white"
                      }`}
                    >
                      {user.username}
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#ea580c]"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
                    <Shield className="w-2.5 h-2.5 text-orange-900" />
                    <span className="group-hover:text-orange-900 transition-colors">PQC_LATTICE_ENCRYPTED</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-orange-900/40 p-4 bg-[#0a0a0a]/90 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase">
          <span className="w-2 h-2 bg-orange-600 rounded-full shadow-[0_0_5px_#ea580c]"></span>
          STABLE_NET
        </div>
        <button className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-zinc-600 hover:text-orange-500 transition-all uppercase active:scale-95">
          <LogOut className="w-3.5 h-3.5" />
          <span>Disconnect</span>
        </button>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(1000%); opacity: 0; }
        }

        ::-webkit-scrollbar {
          width: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: #442200;
          border-radius: 0px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
    </div>
  );
}