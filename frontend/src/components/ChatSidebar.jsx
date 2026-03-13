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
    <div className="w-80 h-full bg-black text-[#00ff99] relative overflow-hidden flex flex-col border-r border-[#00ff99]/20 shadow-[0_0_20px_#00ff99aa]">
      {/* Neon grid background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(0,255,100,0.05)_0%,_black_80%)]"></div>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(0,255,100,0.2)_1px,transparent_1px),linear-gradient(rgba(0,255,100,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Scanning line */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="w-full h-1 bg-[#00ff99]/20 animate-[scan_4s_linear_infinite]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 border-b border-[#00ff99]/20 bg-black/60 backdrop-blur-md text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-[#00ff99]/20 border border-[#00ff99]/40 rounded-md flex items-center justify-center">
            <Lock className="w-4 h-4 text-[#00ff99]" />
          </div>
          <h2 className="text-lg font-bold tracking-widest text-[#00ff99] drop-shadow-[0_0_10px_#00ff99]">
            SECURE CHANNELS
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 p-3 border-b border-[#00ff99]/10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#00ff99aa]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search secure connections..."
            className="w-full bg-black/60 border border-[#00ff99]/20 text-[#00ff99] rounded-lg py-2 pl-9 pr-8 placeholder-[#00ff9960] focus:outline-none focus:ring-2 focus:ring-[#00ff99]/50"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-[#00ff99bb] hover:text-[#00ffcc] transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="relative z-10 px-4 py-2 border-b border-[#00ff99]/10 text-xs flex justify-between">
        <div className="flex items-center gap-2 text-[#00ffcc] font-mono">
          <Network className="w-3 h-3" />
          <span>
            {filteredConnections.length} active connection
            {filteredConnections.length !== 1 ? "s" : ""}
          </span>
        </div>
        {searchTerm && (
          <span className="text-[#00ff99cc] italic">
            filtering: "{searchTerm}"
          </span>
        )}
      </div>

      {/* Connections List */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3">
        {filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#00ff99cc]">
            {searchTerm ? (
              <>
                <Search className="w-10 h-10 text-[#00ff99]" />
                <p className="mt-2 font-mono">No secure channels found</p>
              </>
            ) : (
              <>
                <Cpu className="w-10 h-10 text-[#00ff99]" />
                <p className="mt-2 font-mono">Secure network ready</p>
                <p className="text-xs text-[#00ff9980]">
                  Establish connections to begin
                </p>
              </>
            )}
          </div>
        ) : (
          filteredConnections.map((user) => (
            <div
              key={user.user_id}
              onClick={() => handleSelectUser(user)}
              className={`group cursor-pointer mb-2 p-3 rounded-lg border transition-all duration-200 ${
                selectedUserId === user.user_id
                  ? "bg-[#00ff9920] border-[#00ff99]/60 shadow-[0_0_20px_#00ff9940]"
                  : "bg-black/60 border-[#00ff99]/20 hover:bg-[#00ff9910] hover:border-[#00ff99]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-black text-sm bg-[#00ff99] group-hover:shadow-[0_0_15px_#00ff99] transition ${
                    selectedUserId === user.user_id
                      ? "shadow-[0_0_20px_#00ff99]"
                      : ""
                  }`}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold truncate ${
                        selectedUserId === user.user_id
                          ? "text-[#00ffcc]"
                          : "text-[#00ff99bb]"
                      }`}
                    >
                      {user.username}
                    </h3>
                    <div className="flex items-center gap-1 text-[#00ff99aa] text-xs">
                      <div className="w-1.5 h-1.5 bg-[#00ff99] rounded-full animate-pulse"></div>
                      <span>live</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#00ff99aa] text-xs">
                    <Shield className="w-3 h-3" />
                    <span>AES-256 encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-[#00ff99]/10 p-3 text-xs text-[#00ff99cc] flex justify-between items-center font-mono bg-black/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff99] rounded-full animate-pulse"></div>
          <span>SECURE NETWORK</span>
        </div>
        <button className="flex items-center gap-1 text-[#00ff99aa] hover:text-[#00ffcc] transition">
          <LogOut className="w-3 h-3" />
          <span>Disconnect</span>
        </button>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00ff99, #00cc88);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00ffcc, #00ff99);
        }
      `}</style>
    </div>
  );
}
