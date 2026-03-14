import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons ────────────────────────────────────────────────────────────────────

const LockOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 11V7a4 4 0 1 1 8 0m-4 8v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" />
  </svg>
);

const SecretKeyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z" />
  </svg>
);

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const NonceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="4" /><path d="m10.85 12.15 5.65-5.65" /><path d="m16 7 1 1" /><path d="m18 5 1 1" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const InboxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 11V7a4 4 0 1 1 8 0m-4 8v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" />
  </svg>
);

// ─── Input config ─────────────────────────────────────────────────────────────

const INPUTS = [
  { key: "sharedSecret",     label: "Shared Secret",   badge: "256-bit",  icon: <SecretKeyIcon />, dot: "bg-green-500",  card: "border-green-200",  iconBg: "bg-green-50 text-green-600",  text: "text-green-700"  },
  { key: "encryptedMessage", label: "Encrypted Msg",   badge: "AES-GCM",  icon: <MessageIcon />,   dot: "bg-blue-500",   card: "border-blue-200",   iconBg: "bg-blue-50 text-blue-600",    text: "text-blue-700"   },
  { key: "iv",               label: "Init. Vector",    badge: "IV/Nonce", icon: <NonceIcon />,     dot: "bg-amber-500",  card: "border-amber-200",  iconBg: "bg-amber-50 text-amber-600",  text: "text-amber-700"  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Phase6MessageDecryption({
  sharedSecret,
  encryptedMessage,
  iv,
  processing,
  decryptedMessage,
  handleDecryptMessage,
}) {
  const values = { sharedSecret, encryptedMessage, iv };
  const allReady = INPUTS.every(({ key }) => !!values[key]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-blue-300" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Phase 6</span>
          <div className="h-px w-8 bg-blue-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Message Decryption</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Decrypt the ciphertext using the recovered shared secret and initialization vector
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        {/* ── Section 1: Decryption Control ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><LockOpenIcon /></div>
            <h3 className="text-sm font-semibold text-gray-800">Decryption Control</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Readiness dots */}
            <div className="flex flex-wrap items-center gap-4">
              {INPUTS.map(({ key, label, dot }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${values[key] ? dot + " animate-pulse" : "bg-gray-300"}`} />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>

            {/* Decrypt button */}
            <button
              onClick={handleDecryptMessage}
              disabled={!allReady || processing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap ${
                processing
                  ? "bg-blue-400 cursor-not-allowed"
                  : !allReady
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {processing ? (
                <><Spinner /> Decrypting…</>
              ) : (
                <><LockOpenIcon /> Decrypt Message (AES-GCM)</>
              )}
            </button>
          </div>

          {!allReady && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600"><WarnIcon /></span>
              <span className="text-xs text-amber-700">
                {!sharedSecret && "Complete decapsulation (Step 7–8) to get shared secret. "}
                {!encryptedMessage && "Complete encryption (Step 3–4) to get encrypted message. "}
                {!iv && "IV is required from the encryption step."}
              </span>
            </div>
          )}
        </div>

        {/* ── Section 2: Process Visualization ── */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-5 text-center">
            AES-GCM Decryption Process
          </p>

          {/* Input cards grid */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mb-5">
            {INPUTS.map(({ key, label, badge, icon, dot, card, iconBg, text }) => (
              <motion.div
                key={key}
                animate={processing ? { opacity: 0.6, scale: 0.97, y: 6 } : { opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative bg-white rounded-xl p-3 border-2 ${card}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`p-1.5 rounded-lg ${iconBg}`}>{icon}</span>
                  <span className={`text-[9px] font-semibold font-mono px-1.5 py-0.5 rounded ${text}`} style={{ background: "rgba(0,0,0,0.04)" }}>
                    {badge}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-gray-600 mb-1">{label}</p>
                <p className="font-mono text-[10px] text-gray-400 truncate">
                  {values[key] ? values[key].substring(0, 20) + "…" : "— waiting —"}
                </p>
                {values[key] && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 ${dot} rounded-full border-2 border-white`} />
                )}
              </motion.div>
            ))}
          </div>

          {/* Center vessel + status */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center min-w-[160px]"
              animate={
                processing
                  ? { scale: [1, 1.08, 1], borderColor: ["#e5e7eb", "#3b82f6", "#10b981", "#e5e7eb"] }
                  : { scale: 1, borderColor: "#e5e7eb" }
              }
              transition={{ duration: 1.6, repeat: processing ? Infinity : 0 }}
            >
              {processing && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-blue-100 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <div className="relative text-center z-10">
                <div className="text-[11px] font-bold text-gray-700">
                  {processing ? "🔓 DECRYPTING" : "⚡ AES-GCM"}
                </div>
                <div className="text-[9px] text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                  <span>Decryption Vessel</span>
                  {processing && <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />}
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {processing && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-medium text-blue-700">AES-GCM decryption in progress…</span>
                </motion.div>
              )}
              {decryptedMessage && !processing && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <span className="text-green-600"><CheckIcon /></span>
                  <span className="text-[10px] font-medium text-green-700">Decrypted</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Section 3: Output Panel ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <AnimatePresence mode="wait">
            {decryptedMessage ? (
              <motion.div key="decrypted" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <CheckIcon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Message decrypted successfully</p>
                    <p className="text-xs text-green-600">AES-GCM decryption complete — message verified</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                    <ShieldIcon /> Verified
                  </span>
                </div>

                {/* Decrypted message display */}
                <div className="bg-white rounded-lg border border-green-200 p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 -ml-1" />
                      <span className="text-xs text-gray-500 ml-1">Plaintext message</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700">
                        <CopyIcon /> Copy
                      </button>
                      <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">✓ Verified</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-lg font-medium text-gray-800 break-words">"{decryptedMessage}"</p>
                  </div>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500 mb-1">Decryption Status</p>
                    <p className="text-xs font-semibold text-green-600 flex items-center gap-1"><CheckIcon size={10} /> Successful</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500 mb-1">Algorithm</p>
                    <p className="text-xs font-semibold text-blue-600">AES-256-GCM</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500 mb-1">Next Step</p>
                    <p className="text-xs font-semibold text-purple-600">Sig. Verification</p>
                  </div>
                </div>

                {/* IV used */}
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400 px-1">
                  <ClockIcon />
                  <span>IV used: {iv?.substring(0, 8)}…</span>
                  <span className="mx-1">·</span>
                  <CheckIcon size={10} />
                  <span className="text-green-500">AES-GCM integrity verified</span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                  <InboxIcon />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Awaiting decryption</p>
                <p className="text-xs text-gray-400">Click "Decrypt Message" to reveal the original text</p>
                {!allReady && (
                  <p className="mt-3 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-full">
                    Complete Phases 1–5 to prepare decryption inputs
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Section 4: How it works ── */}
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start gap-2.5">
            <span className="text-blue-500 mt-0.5 flex-shrink-0"><InfoIcon /></span>
            <div>
              <p className="text-xs font-semibold text-blue-800 mb-0.5">AES-GCM Decryption</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-medium">Step 9</span> — The receiver uses the recovered shared secret and the IV to decrypt the ciphertext.
                AES-GCM provides both confidentiality and authentication, ensuring the message hasn't been tampered with during transmission.
                The decrypted message should match the sender's original message.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}