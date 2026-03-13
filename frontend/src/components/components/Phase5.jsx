import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// ─── Icons ────────────────────────────────────────────────────────────────────

const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="4" /><path d="m10.85 12.15 5.65-5.65" /><path d="m16 7 1 1" /><path d="m18 5 1 1" />
  </svg>
);

const LockOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 11V7a4 4 0 1 1 8 0m-4 8v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

const SecretKeyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z" />
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

const PlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Phase5KeyDecapsulation({
  kyberCiphertext,
  sharedSecret,
  decapsulating,
  handleDecapsulate,
  receiver,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-amber-300" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-600">Phase 5</span>
          <div className="h-px w-8 bg-amber-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Key Decapsulation</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Recover the shared secret using Kyber ciphertext and the recipient's private key
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        {/* ── Section 1: Decapsulation Control ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><SecretKeyIcon /></div>
            <h3 className="text-sm font-semibold text-gray-800">Decapsulation Control</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Readiness dots */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${kyberCiphertext ? "bg-amber-500 animate-pulse" : "bg-gray-300"}`} />
                <span className="text-xs text-gray-600">Ciphertext ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-600">Private key loaded</span>
              </div>
            </div>

            {/* Decapsulate button */}
            <button
              onClick={handleDecapsulate}
              disabled={!kyberCiphertext || decapsulating}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap ${
                decapsulating
                  ? "bg-amber-400 cursor-not-allowed"
                  : !kyberCiphertext
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 active:scale-95"
              }`}
            >
              {decapsulating ? (
                <><Spinner /> Decapsulating…</>
              ) : (
                <><LockOpenIcon /> Decapsulate (Kyber)</>
              )}
            </button>
          </div>

          {!kyberCiphertext && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600"><WarnIcon /></span>
              <span className="text-xs text-amber-700">
                Complete key exchange (Step 1–2) to get ciphertext
              </span>
            </div>
          )}
        </div>

        {/* ── Section 2: Process Visualization ── */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-5 text-center">
            Decapsulation Process Visualization
          </p>

          {/* Input cards row */}
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-6 gap-4">

            {/* Kyber Ciphertext */}
            <motion.div
              animate={decapsulating ? { x: 20, scale: 1.03 } : { x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="flex-1"
            >
              <div className={`bg-white rounded-xl p-3 border-2 ${kyberCiphertext ? "border-amber-200" : "border-gray-200"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><LockIcon /></span>
                  <span className="text-[9px] font-semibold font-mono px-1.5 py-0.5 rounded text-amber-700" style={{ background: "rgba(0,0,0,0.04)" }}>
                    INPUT A
                  </span>
                </div>
                <p className="text-[11px] font-medium text-gray-600 mb-1">Kyber Ciphertext</p>
                <p className="font-mono text-[10px] text-gray-400 truncate">
                  {kyberCiphertext ? kyberCiphertext.substring(0, 22) + "…" : "— waiting —"}
                </p>
                {kyberCiphertext && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                )}
              </div>
            </motion.div>

            {/* Channel indicator */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="relative w-24 flex items-center">
                <div className="flex-1 h-px bg-gray-200" />
                <AnimatePresence>
                  {decapsulating && (
                    <motion.div
                      className="absolute left-0"
                      animate={{ left: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full -translate-y-1/2 shadow" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Center vessel */}
              <motion.div
                className="mt-1 px-3 py-2 rounded-xl bg-white border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center min-w-[100px]"
                animate={
                  decapsulating
                    ? {
                        scale: [1, 1.08, 1],
                        borderColor: ["#e5e7eb", "#f59e0b", "#10b981", "#e5e7eb"],
                      }
                    : { scale: 1, borderColor: "#e5e7eb" }
                }
                transition={{ duration: 1.6, repeat: decapsulating ? Infinity : 0 }}
              >
                <div className="text-[11px] font-bold text-gray-700">
                  {decapsulating ? "🔄 DECAPSULATING" : "⚡ KYBER"}
                </div>
                <div className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <span>Key Decapsulation</span>
                  {decapsulating && (
                    <span className="w-1 h-1 bg-amber-500 rounded-full animate-ping" />
                  )}
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {decapsulating && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full mt-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-medium text-amber-700">Recovering secret…</span>
                  </motion.div>
                )}
                {sharedSecret && !decapsulating && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full mt-1">
                    <span className="text-green-600"><CheckIcon /></span>
                    <span className="text-[10px] font-medium text-green-700">Recovered</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Receiver Private Key */}
            <motion.div
              animate={decapsulating ? { x: -20, scale: 1.03 } : { x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="flex-1"
            >
              <div className="bg-white rounded-xl p-3 border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="p-1.5 rounded-lg bg-green-50 text-green-600"><SecretKeyIcon /></span>
                  <span className="text-[9px] font-semibold font-mono px-1.5 py-0.5 rounded text-green-700" style={{ background: "rgba(0,0,0,0.04)" }}>
                    INPUT B
                  </span>
                </div>
                <p className="text-[11px] font-medium text-gray-600 mb-1">Receiver Private Key</p>
                <p className="font-mono text-[10px] text-gray-400 truncate">
                  {receiver?.kyberPrivate ?? "— loaded —"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Section 3: Receiver Panel (Output) ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <AnimatePresence mode="wait">
            {sharedSecret ? (
              <motion.div
                key="recovered"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <CheckIcon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Shared secret recovered successfully</p>
                    <p className="text-xs text-green-600">Identical to the sender's shared secret</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                    <ShieldIcon /> Ready to decrypt
                  </span>
                </div>

                {/* Secret display */}
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 -ml-1" />
                      <span className="text-xs text-gray-500 ml-1">Decapsulated secret (hex)</span>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700">
                      <CopyIcon /> Copy
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-gray-700 break-all bg-gray-50 p-2 rounded">
                    {sharedSecret}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1 text-green-600"><CheckIcon size={10} /> Successfully recovered</span>
                    <span className="flex items-center gap-1 text-amber-600"><ClockIcon /> Ready for decryption</span>
                  </div>
                </div>

                {/* Key Establishment Complete */}
                <div className="mt-3 flex items-center gap-3 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-800">Key Establishment Complete</p>
                    <p className="text-[10px] text-blue-600">
                      The recovered shared secret matches the sender's secret. This symmetric key will now be used for AES-GCM decryption.
                    </p>
                  </div>
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
                  <PlusIcon />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Awaiting decapsulation</p>
                <p className="text-xs text-gray-400">Click "Decapsulate" to recover the shared secret</p>
                {!kyberCiphertext && (
                  <p className="mt-3 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-full">
                    Complete key exchange (Step 1–2) to prepare
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Section 4: How it works ── */}
        <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
          <div className="flex items-start gap-2.5">
            <span className="text-amber-500 mt-0.5 flex-shrink-0"><InfoIcon /></span>
            <div>
              <p className="text-xs font-semibold text-amber-800 mb-0.5">Kyber Decapsulation</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                <span className="font-medium">Step 7 &amp; 8</span> — The receiver uses their private key to decapsulate the Kyber ciphertext,
                recovering the identical shared secret that was generated by the sender. This process is the inverse of the key encapsulation
                performed in Step 2, completing the post-quantum key exchange.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}