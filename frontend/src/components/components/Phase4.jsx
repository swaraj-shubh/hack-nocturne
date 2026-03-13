import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons ────────────────────────────────────────────────────────────────────

const TransmitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="4"/><path d="m10.85 12.15 5.65-5.65"/><path d="m16 7 1 1"/><path d="m18 5 1 1"/>
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);

const SignIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z"/>
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

// ─── Package components config ────────────────────────────────────────────────

const COMPONENTS = [
  { key: "kyberCiphertext", label: "Kyber Ciphertext",   badge: "KEM",      icon: <LockIcon />, dot: "bg-amber-500",  card: "border-amber-200",  iconBg: "bg-amber-50 text-amber-600",  text: "text-amber-700"  },
  { key: "encryptedMessage", label: "Encrypted Message", badge: "AES-GCM",  icon: <LockIcon />, dot: "bg-green-500",  card: "border-green-200",  iconBg: "bg-green-50 text-green-600",  text: "text-green-700"  },
  { key: "iv",               label: "Init. Vector (IV)", badge: "IV",        icon: <KeyIcon />,  dot: "bg-amber-400",  card: "border-amber-200",  iconBg: "bg-amber-50 text-amber-600",  text: "text-amber-700"  },
  { key: "signature",        label: "Signature",         badge: "Dilithium", icon: <SignIcon />, dot: "bg-purple-500", card: "border-purple-200", iconBg: "bg-purple-50 text-purple-600", text: "text-purple-700" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Phase4SecureTransmission({
  kyberCiphertext,
  encryptedMessage,
  iv,
  signature,
  transmitting,
  transmitted,
  handleTransmit,
}) {
  const values = { kyberCiphertext, encryptedMessage, iv, signature };
  const allReady = COMPONENTS.every(({ key }) => !!values[key]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-indigo-300" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600">Phase 4</span>
          <div className="h-px w-8 bg-indigo-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Secure Transmission</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Transmit the complete cryptographic package to the receiver through a secure communication channel
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        {/* ── Section 1: Transmission Control ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><TransmitIcon /></div>
            <h3 className="text-sm font-semibold text-gray-800">Transmission Control</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Component readiness dots */}
            <div className="flex flex-wrap items-center gap-4">
              {COMPONENTS.map(({ key, label, dot }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${values[key] ? dot + " animate-pulse" : "bg-gray-300"}`} />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>

            {/* Transmit button */}
            <button
              onClick={handleTransmit}
              disabled={!allReady || transmitting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap ${
                transmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : !allReady
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              }`}
            >
              {transmitting ? (
                <><Spinner /> Transmitting…</>
              ) : (
                <><TransmitIcon /> Transmit Package</>
              )}
            </button>
          </div>

          {!allReady && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600"><WarnIcon /></span>
              <span className="text-xs text-amber-700">
                Complete Phases 1–3 to generate all required components
              </span>
            </div>
          )}
        </div>

        {/* ── Section 2: Outgoing Package ── */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><PackageIcon /></div>
              <h3 className="text-sm font-semibold text-gray-800">Outgoing Package</h3>
            </div>
            <span className="text-[10px] text-gray-400">4 components</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {COMPONENTS.map(({ key, label, badge, icon, dot, card, iconBg, text }) => (
              <motion.div
                key={key}
                animate={transmitting ? { opacity: 0.55, scale: 0.97 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative bg-white rounded-xl p-3 border ${card}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`p-1.5 rounded-lg ${iconBg}`}>{icon}</span>
                  <span className={`text-[9px] font-semibold font-mono px-1.5 py-0.5 rounded ${text} bg-opacity-10`} style={{ background: "rgba(0,0,0,0.04)" }}>
                    {badge}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-gray-600 mb-1">{label}</p>
                <p className="font-mono text-[10px] text-gray-400 truncate">
                  {values[key] ? values[key].substring(0, 22) + "…" : "— waiting —"}
                </p>
                {values[key] && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 ${dot} rounded-full border-2 border-white`} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Transmission Channel ── */}
        <div className="px-6 py-6 border-b border-gray-100">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-5 text-center">
            Transmission Channel
          </p>

          {/* Sender ↔ Receiver row */}
          <div className="flex items-center justify-between max-w-lg mx-auto mb-6">
            {/* Sender */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <KeyIcon />
              </div>
              <span className="text-xs font-semibold text-gray-700">Sender</span>
              <span className="text-[10px] text-gray-400">Alice</span>
              <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">encryption</span>
            </div>

            {/* Channel indicator */}
            <div className="flex-1 mx-4 flex flex-col items-center gap-1">
              <div className="relative w-full flex items-center">
                <div className="flex-1 h-px bg-gray-200" />
                <AnimatePresence>
                  {transmitting && (
                    <motion.div
                      className="absolute left-0"
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full -translate-y-1/2 shadow" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <AnimatePresence mode="wait">
                {transmitting && (
                  <motion.div key="tx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full mt-1">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-medium text-indigo-700">Transmitting…</span>
                  </motion.div>
                )}
                {transmitted && !transmitting && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full mt-1">
                    <span className="text-green-600"><CheckIcon /></span>
                    <span className="text-[10px] font-medium text-green-700">Delivered</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Receiver */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-500 ${transmitted ? "bg-green-600" : "bg-gray-400"}`}>
                <KeyIcon />
              </div>
              <span className="text-xs font-semibold text-gray-700">Receiver</span>
              <span className="text-[10px] text-gray-400">Bob</span>
              <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">decryption</span>
            </div>
          </div>

          {/* Flying packets during transmission */}
          <div className="relative h-12 overflow-hidden max-w-lg mx-auto">
            <AnimatePresence>
              {transmitting && [
                { key: "k", label: "kyber.cipher",   color: "amber",  delay: 0.0 },
                { key: "e", label: "encrypted.msg",  color: "green",  delay: 0.3 },
                { key: "i", label: "iv.vector",      color: "amber",  delay: 0.6 },
                { key: "s", label: "dilithium.sig",  color: "purple", delay: 0.9 },
              ].map(({ key, label, color, delay }) => {
                const styles = {
                  amber:  "bg-amber-50 border-amber-300 text-amber-700",
                  green:  "bg-green-50 border-green-300 text-green-700",
                  purple: "bg-purple-50 border-purple-300 text-purple-700",
                };
                const dots = { amber: "bg-amber-500", green: "bg-green-500", purple: "bg-purple-500" };
                return (
                  <motion.div
                    key={key}
                    className="absolute top-1/2 -translate-y-1/2"
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.8, delay, ease: "easeInOut" }}
                  >
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono whitespace-nowrap ${styles[color]}`}>
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dots[color]}`} />
                      {label}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Section 4: Receiver Panel ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <AnimatePresence mode="wait">
            {transmitted ? (
              <motion.div
                key="received"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <CheckIcon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Package received successfully</p>
                    <p className="text-xs text-green-600">All 4 components transmitted and verified</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                    <ShieldIcon /> Ready to decrypt
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {COMPONENTS.map(({ key, label, dot, card }) => (
                    <div key={key} className={`bg-white rounded-lg border p-3 ${card}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-2 h-2 rounded-full ${dot}`} />
                        <span className="text-xs font-medium text-gray-600">{label}</span>
                        <span className="ml-auto text-[9px] text-green-600">✓</span>
                      </div>
                      <p className="font-mono text-[10px] text-gray-500 truncate">{values[key]}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                  <InboxIcon />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Awaiting transmission</p>
                <p className="text-xs text-gray-400">Package will appear here once transmitted</p>
                {!allReady && (
                  <p className="mt-3 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-full">
                    Complete Phases 1–3 to prepare the package
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Section 5: How it works ── */}
        <div className="px-6 py-4 bg-indigo-50 border-t border-indigo-100">
          <div className="flex items-start gap-2.5">
            <span className="text-indigo-500 mt-0.5 flex-shrink-0"><InfoIcon /></span>
            <div>
              <p className="text-xs font-semibold text-indigo-800 mb-0.5">Secure Transmission Protocol</p>
              <p className="text-xs text-indigo-700 leading-relaxed">
                <span className="font-medium">Step 6</span> — All four components (Kyber ciphertext, AES-GCM encrypted message, IV, and Dilithium signature)
                are transmitted through a secure channel. The receiver uses these to decrypt the message and verify
                its authenticity using the corresponding public key.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}