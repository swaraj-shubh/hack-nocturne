import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Key icon SVG inline (no external dep needed)
const KeyIcon = ({ size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="15" r="4" />
    <path d="m10.85 12.15 5.65-5.65" />
    <path d="m16 7 1 1" />
    <path d="m18 5 1 1" />
  </svg>
);

const LockClosedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

const LockOpenIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ZapIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// ─── Sub-components ──────────────────────────────────────────────────────────

function KeyRow({ label, value, isSecret = false }) {
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <span
          className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
            isSecret
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {isSecret ? "secret" : "public"}
        </span>
      </div>
      <div className="font-mono text-[11px] text-gray-700 bg-white border border-gray-200 rounded-md px-2.5 py-1.5 leading-relaxed break-all">
        {value}
      </div>
    </div>
  );
}

function ParticipantCard({ name, badges, keys, accentColor }) {
  const isBlue = accentColor === "blue";
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Top accent bar */}
      <div
        className={`h-0.5 w-full ${
          isBlue
            ? "bg-gradient-to-r from-blue-500 to-blue-400"
            : "bg-gradient-to-r from-green-500 to-emerald-400"
        }`}
      />
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isBlue ? "bg-blue-50" : "bg-green-50"
          }`}
        >
          <KeyIcon size={18} color={isBlue ? "#185FA5" : "#3B6D11"} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">{name}</p>
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {badges.map((b) => (
              <span
                key={b.label}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${b.className}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
        {/* Online dot */}
        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
      </div>
      {/* Keys */}
      <div className="px-4 py-3 bg-gray-50">
        {keys.map((k) => (
          <KeyRow key={k.label} label={k.label} value={k.value} isSecret={k.secret} />
        ))}
      </div>
    </div>
  );
}

function StatusCell({ icon, label, children }) {
  return (
    <div className="p-3 border-r border-gray-100 last:border-r-0">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Phase1KeyExchange({
  connected,
  animating,
  kyberCiphertext,
  sharedSecret,
  handleConnect,
  sender,
  receiver,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-blue-300" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">
            Phase 1
          </span>
          <div className="h-px w-8 bg-blue-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Key Exchange</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Establish a secure shared secret using Kyber post-quantum key encapsulation
        </p>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-[1fr_160px_1fr] gap-4 items-start">
        {/* Sender */}
        <ParticipantCard
          name={sender.name}
          accentColor="blue"
          badges={[
            { label: "encryption", className: "bg-blue-50 text-blue-700" },
            { label: "signing", className: "bg-purple-50 text-purple-700" },
          ]}
          keys={[
            { label: "Kyber Public", value: sender.kyberPublic, secret: false },
            { label: "Kyber Private", value: sender.kyberPrivate, secret: true },
            { label: "Dilithium Private", value: sender.dilithiumPrivate, secret: true },
          ]}
        />

        {/* Center column */}
        <div className="flex flex-col items-center gap-3 pt-3">
          {/* Connect button */}
          <button
            onClick={handleConnect}
            disabled={animating}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold transition-all duration-200 ${
              animating
                ? "bg-amber-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {animating ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Connecting…
              </>
            ) : (
              <>
                <KeyIcon size={13} />
                Connect &amp; Exchange
              </>
            )}
          </button>

          {/* Status dot */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                connected ? "bg-green-500 animate-pulse" : "bg-gray-300"
              }`}
            />
            <span className="text-[11px] text-gray-500 text-center leading-tight">
              {connected ? "Secure connection established" : "Awaiting connection"}
            </span>
          </div>

          {/* Animated packets channel */}
          <div className="relative w-full h-10 flex items-center">
            {/* Track line */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200 -translate-y-1/2" />

            <AnimatePresence>
              {animating && (
                <>
                  {/* Sender → Receiver */}
                  <motion.div
                    className="absolute left-0 z-10"
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: "140px", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.9, delay: 0.1, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-1 bg-white border border-blue-200 rounded-full px-2 py-1 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="font-mono text-[9px] text-blue-600 whitespace-nowrap">
                        kyb-pub
                      </span>
                    </div>
                  </motion.div>

                  {/* Receiver → Sender */}
                  <motion.div
                    className="absolute right-0 z-10"
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: "-140px", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.9, delay: 0.4, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-1 bg-white border border-green-200 rounded-full px-2 py-1 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="font-mono text-[9px] text-green-600 whitespace-nowrap">
                        kyb-pub
                      </span>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Receiver */}
        <ParticipantCard
          name={receiver.name}
          accentColor="green"
          badges={[
            { label: "decryption", className: "bg-green-50 text-green-700" },
            { label: "verification", className: "bg-orange-50 text-orange-700" },
          ]}
          keys={[
            { label: "Kyber Public", value: receiver.kyberPublic, secret: false },
            { label: "Kyber Private", value: receiver.kyberPrivate, secret: true },
            { label: "Dilithium Public", value: receiver.dilithiumPublic, secret: false },
          ]}
        />
      </div>
{/* Encapsulation Section Heading */}
      <div className="mt-10 mb-1 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2">
          <LockClosedIcon />
          <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
            Kyber Encapsulation
          </h3>
        </div>
        <p className="text-sm text-gray-500 mt-1.5 px-3 py-1 bg-gray-50 rounded-md border border-gray-100">
          Performs encapsulation using the receiver's Kyber public key
        </p>
      </div>      {/* Status Panel */}
      <div className="mt-5 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Generates:-
          </span>
          <span className="text-[10px] text-gray-400">Step 1 / 2</span>
        </div>

        {/* Three cells */}
        <div className="grid grid-cols-3">
          {/* Kyber Ciphertext */}
          <StatusCell icon={<LockClosedIcon />} label="Kyber Ciphertext">
            <div
              className={`font-mono text-[11px] px-2.5 py-2 rounded-md border transition-all duration-400 leading-relaxed ${
                kyberCiphertext
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              {kyberCiphertext || (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" />
                  waiting for exchange…
                </span>
              )}
            </div>
          </StatusCell>

          {/* Shared Secret */}
          <StatusCell icon={<LockOpenIcon />} label="Shared Secret">
            <div
              className={`font-mono text-[11px] px-2.5 py-2 rounded-md border transition-all duration-400 leading-relaxed ${
                sharedSecret
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              {sharedSecret || (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" />
                  waiting for exchange…
                </span>
              )}
            </div>
          </StatusCell>

          {/* Status */}
          <StatusCell icon={<ZapIcon />} label="Status">
            <div className="px-2.5 py-2 rounded-md bg-gray-50 border border-gray-200">
              {animating ? (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                  <span className="text-[11px] font-medium text-amber-600">
                    Performing encapsulation…
                  </span>
                </div>
              ) : connected ? (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[11px] font-medium text-green-600">Keys exchanged ✓</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                  <span className="text-[11px] text-gray-400">Idle</span>
                </div>
              )}
            </div>
          </StatusCell>
        </div>

        {/* Footer note */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400">
            Values are simulated for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
}