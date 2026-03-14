import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons ────────────────────────────────────────────────────────────────────

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="4" />
    <path d="m10.85 12.15 5.65-5.65" />
    <path d="m16 7 1 1" /><path d="m18 5 1 1" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputCard({ label, tag, tagColor, children }) {
  const tagStyles = {
    green: "bg-green-50 text-green-700 border border-green-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        {tag && (
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${tagStyles[tagColor]}`}>
            {tag}
          </span>
        )}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function OutputField({ label, icon, value, colorScheme }) {
  const schemes = {
    green: {
      active: "bg-green-50 border-green-200 text-green-800",
      inactive: "bg-gray-50 border-gray-200 border-dashed text-gray-400",
      badge: "bg-green-50 text-green-700 border border-green-200",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    amber: {
      active: "bg-amber-50 border-amber-200 text-amber-800",
      inactive: "bg-gray-50 border-gray-200 border-dashed text-gray-400",
      badge: "bg-amber-50 text-amber-700 border border-amber-200",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  };
  const s = schemes[colorScheme];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${s.iconBg} ${s.iconColor}`}>{icon}</div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {value && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ml-auto ${s.badge}`}>
            ready
          </span>
        )}
      </div>
      <div className={`p-3.5 rounded-xl border transition-all duration-300 ${value ? s.active : s.inactive}`}>
        {value ? (
          <p className="font-mono text-xs break-all leading-relaxed">{value}</p>
        ) : (
          <div className="flex items-center gap-2 py-1">
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse" />
            <span className="text-xs">Waiting for encryption…</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Phase2MessageEncryption({
  message,
  setMessage,
  sharedSecret,
  mixing,
  processing,
  encryptedMessage,
  iv,
  handleMixAndEncrypt,
}) {
  const busy = mixing || processing;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-blue-300" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">
            Phase 2
          </span>
          <div className="h-px w-8 bg-blue-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Message Encryption</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Combine the shared secret with your message and encrypt using AES-GCM for confidentiality
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        {/* ── Section 1: Message Input ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><PencilIcon /></div>
            <h3 className="text-sm font-semibold text-gray-800">Message Input</h3>
          </div>

          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Enter the message you want to encrypt
          </label>

          <div className="flex gap-3 items-center">
            {/* Input wrapper */}
            <div className="relative flex-1">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-mono text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Type your secret message here…"
              />
              {message && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-green-600 font-medium">ready</span>
                </div>
              )}
            </div>

            {/* Encrypt button */}
            <button
              onClick={handleMixAndEncrypt}
              disabled={!sharedSecret || busy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap ${
                busy
                  ? "bg-amber-500 cursor-not-allowed"
                  : !sharedSecret
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {mixing ? (
                <><Spinner /> Mixing…</>
              ) : processing ? (
                <><Spinner /> Encrypting…</>
              ) : (
                <><LockIcon /> Mix &amp; Encrypt</>
              )}
            </button>
          </div>

          {/* Warning: no shared secret */}
          {!sharedSecret && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600"><WarnIcon /></span>
              <span className="text-xs text-amber-700">
                Complete Phase 1 key exchange first to obtain a shared secret
              </span>
            </div>
          )}
        </div>

        {/* ── Section 2: Process Visualization ── */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-4 text-center">
            Encryption Process
          </p>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            {/* Input A — Shared Secret */}
            <motion.div
              animate={mixing ? { x: 24, scale: 1.03 } : { x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <InputCard label="Input A" tag="shared secret" tagColor="green">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-green-50 rounded text-green-600 mt-0.5 flex-shrink-0"><KeyIcon /></div>
                  <div className="font-mono text-[11px] text-gray-700 break-all leading-relaxed">
                    {sharedSecret ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                        {sharedSecret.substring(0, 28)}…
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">— awaiting key exchange —</span>
                    )}
                  </div>
                </div>
              </InputCard>
            </motion.div>

            {/* Center — mixing vessel */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-28 h-20 rounded-xl bg-white border-2 flex flex-col items-center justify-center overflow-hidden relative"
                animate={
                  mixing
                    ? { borderColor: "#3b82f6", scale: [1, 1.06, 1] }
                    : processing
                    ? { borderColor: "#f59e0b" }
                    : { borderColor: "#e5e7eb", scale: 1 }
                }
                transition={{ duration: 1.2, repeat: mixing ? Infinity : 0 }}
              >
                {processing && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
                <div className="relative z-10 text-center px-2">
                  <div className="text-lg mb-0.5">
                    {processing ? "🔐" : mixing ? "🔄" : "⚗️"}
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                    {processing ? "Encrypting" : mixing ? "Mixing" : "AES-GCM"}
                  </div>
                </div>
              </motion.div>

              {/* Arrow down */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-px h-3 bg-gray-300" />
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-300" />
              </div>

              {/* Status badge */}
              <AnimatePresence mode="wait">
                {mixing && (
                  <motion.div
                    key="mixing"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-medium text-blue-600">Mixing inputs…</span>
                  </motion.div>
                )}
                {processing && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full"
                  >
                    <Spinner />
                    <span className="text-[10px] font-medium text-amber-700">AES-GCM running…</span>
                  </motion.div>
                )}
                {!mixing && !processing && encryptedMessage && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full"
                  >
                    <span className="text-green-600"><CheckIcon /></span>
                    <span className="text-[10px] font-medium text-green-700">Done</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input B — Plaintext Message */}
            <motion.div
              animate={mixing ? { x: -24, scale: 1.03 } : { x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <InputCard label="Input B" tag="plaintext" tagColor="blue">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-blue-50 rounded text-blue-600 mt-0.5 flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 break-words leading-relaxed">
                    {message ? `"${message}"` : <span className="text-gray-400 italic text-xs">No message entered</span>}
                  </p>
                </div>
              </InputCard>
            </motion.div>
          </div>
        </div>

        {/* ── Section 3: Output ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-green-50 rounded-lg text-green-600"><ShieldIcon /></div>
            <h3 className="text-sm font-semibold text-gray-800">Encryption Output</h3>
            {encryptedMessage && iv && (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                <CheckIcon /> Encryption successful
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <OutputField
              label="Encrypted Message"
              icon={<LockIcon />}
              value={encryptedMessage}
              colorScheme="green"
            />
            <OutputField
              label="Initialization Vector (IV)"
              icon={<KeyIcon />}
              value={iv}
              colorScheme="amber"
            />
          </div>
        </div>

        {/* ── Section 4: How it works ── */}
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start gap-2.5">
            <span className="text-blue-500 mt-0.5 flex-shrink-0"><InfoIcon /></span>
            <div>
              <p className="text-xs font-semibold text-blue-800 mb-0.5">How it works</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-medium text-green-700">Step 3</span> — The shared secret and plaintext message are mixed together as AES-GCM inputs.{" "}
                <span className="font-medium text-amber-700">Step 4</span> — AES-GCM encryption produces a ciphertext and a unique Initialization Vector (IV) required for decryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}