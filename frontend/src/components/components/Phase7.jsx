import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z" />
  </svg>
);

const SignatureIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z" />
  </svg>
);

const PublicKeyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="4" /><path d="m10.85 12.15 5.65-5.65" /><path d="m16 7 1 1" /><path d="m18 5 1 1" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
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

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const InboxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

// ─── Input config ─────────────────────────────────────────────────────────────

const INPUTS = [
  { key: "decryptedMessage", label: "Decrypted Message", badge: "Plaintext",  icon: <MessageIcon />,   dot: "bg-blue-500",   card: "border-blue-200",   iconBg: "bg-blue-50 text-blue-600",    text: "text-blue-700"   },
  { key: "signature",        label: "Digital Signature", badge: "Dilithium", icon: <SignatureIcon />, dot: "bg-purple-500", card: "border-purple-200", iconBg: "bg-purple-50 text-purple-600", text: "text-purple-700" },
  { key: "senderPublicKey",  label: "Sender Public Key", badge: "Public",    icon: <PublicKeyIcon />, dot: "bg-green-500",  card: "border-green-200",  iconBg: "bg-green-50 text-green-600",  text: "text-green-700"  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Phase7SignatureVerification({
  decryptedMessage,
  signature,
  verifying,
  verificationResult,
  handleVerifySignature,
  sender,
}) {
  const values = {
    decryptedMessage,
    signature,
    senderPublicKey: sender?.dilithiumPublic,
  };
  const allReady = !!decryptedMessage && !!signature;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-purple-300" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-purple-600">Phase 7</span>
          <div className="h-px w-8 bg-purple-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Signature Verification</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Verify the message authenticity using Dilithium post-quantum signature verification
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        {/* ── Section 1: Verification Control ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><ShieldCheckIcon /></div>
            <h3 className="text-sm font-semibold text-gray-800">Verification Control</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Readiness dots */}
            <div className="flex flex-wrap items-center gap-4">
              {[
                { label: "Message",    value: decryptedMessage, dot: "bg-blue-500"   },
                { label: "Signature",  value: signature,        dot: "bg-purple-500" },
                { label: "Public Key", value: sender?.dilithiumPublic, dot: "bg-green-500" },
              ].map(({ label, value, dot }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${value ? dot + " animate-pulse" : "bg-gray-300"}`} />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>

            {/* Verify button */}
            <button
              onClick={handleVerifySignature}
              disabled={!allReady || verifying}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap ${
                verifying
                  ? "bg-purple-400 cursor-not-allowed"
                  : !allReady
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 active:scale-95"
              }`}
            >
              {verifying ? (
                <><Spinner /> Verifying…</>
              ) : (
                <><ShieldCheckIcon /> Verify Signature</>
              )}
            </button>
          </div>

          {!allReady && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600"><WarnIcon /></span>
              <span className="text-xs text-amber-700">
                {!decryptedMessage && "Complete decryption (Step 9) to get the message. "}
                {!signature && "Complete signing (Step 5) to generate signature."}
              </span>
            </div>
          )}
        </div>

        {/* ── Section 2: Process Visualization ── */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-5 text-center">
            Dilithium Verification Process
          </p>

          {/* Input cards grid */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mb-5">
            {INPUTS.map(({ key, label, badge, icon, dot, card, iconBg, text }) => (
              <motion.div
                key={key}
                animate={verifying ? { opacity: 0.6, scale: 0.97, y: 6 } : { opacity: 1, scale: 1, y: 0 }}
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
                  {values[key] ? String(values[key]).substring(0, 20) + "…" : "— waiting —"}
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
              className="relative px-6 py-3 rounded-xl bg-white border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center min-w-[160px] overflow-hidden"
              animate={
                verifying
                  ? { scale: [1, 1.08, 1], borderColor: ["#e5e7eb", "#8b5cf6", "#10b981", "#e5e7eb"] }
                  : { scale: 1, borderColor: "#e5e7eb" }
              }
              transition={{ duration: 1.6, repeat: verifying ? Infinity : 0 }}
            >
              {verifying && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <div className="relative text-center z-10">
                <div className="text-[11px] font-bold text-gray-700">
                  {verifying ? "🔍 VERIFYING" : "⚡ DILITHIUM"}
                </div>
                <div className="text-[9px] text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                  <span>Verification Engine</span>
                  {verifying && <span className="w-1 h-1 bg-purple-500 rounded-full animate-ping" />}
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {verifying && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-medium text-purple-700">Dilithium verification in progress…</span>
                </motion.div>
              )}
              {verificationResult !== null && !verifying && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                    verificationResult
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <span>{verificationResult ? <CheckIcon /> : <XIcon />}</span>
                  <span className="text-[10px] font-medium">
                    {verificationResult ? "Signature Valid" : "Verification Failed"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Section 3: Result Panel ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <AnimatePresence mode="wait">
            {verificationResult !== null ? (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Result header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${verificationResult ? "bg-green-500" : "bg-red-500"}`}>
                    {verificationResult ? <CheckIcon size={14} /> : <XIcon size={14} />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${verificationResult ? "text-green-800" : "text-red-800"}`}>
                      {verificationResult ? "Signature verified successfully" : "Signature verification failed"}
                    </p>
                    <p className={`text-xs ${verificationResult ? "text-green-600" : "text-red-600"}`}>
                      {verificationResult ? "Message is authentic and untampered" : "Possible tampering detected"}
                    </p>
                  </div>
                  <span className={`ml-auto text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${
                    verificationResult
                      ? "text-green-700 bg-green-50 border-green-200"
                      : "text-red-700 bg-red-50 border-red-200"
                  }`}>
                    {verificationResult ? "VALID" : "INVALID"}
                  </span>
                </div>

                {/* Result display */}
                <div className={`rounded-lg border p-3 mb-3 ${verificationResult ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <p className={`text-sm font-bold text-center py-2 ${verificationResult ? "text-green-700" : "text-red-700"}`}>
                    {verificationResult
                      ? "✓ SIGNATURE VALID — Message authenticated"
                      : "✗ SIGNATURE INVALID — Message tampered"}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500 mb-1">Algorithm</p>
                    <p className="text-xs font-semibold text-purple-600">Dilithium Level 3</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500 mb-1">Security</p>
                    <p className="text-xs font-semibold text-gray-600">Post-quantum secure</p>
                  </div>
                </div>

                {/* Final celebration banner */}
                {verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="mt-4 p-5 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl text-center"
                  >
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="text-lg font-bold text-green-700 mb-1">Secure Communication Complete!</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Message successfully encrypted, signed, transmitted, decrypted, and verified
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[
                        { label: "Kyber KEM",  color: "bg-green-100 text-green-700 border-green-200"   },
                        { label: "AES-GCM",    color: "bg-blue-100 text-blue-700 border-blue-200"      },
                        { label: "Dilithium",  color: "bg-purple-100 text-purple-700 border-purple-200" },
                      ].map(({ label, color }) => (
                        <span key={label} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${color}`}>
                          <CheckIcon size={9} /> {label}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-[10px] text-gray-400">
                      Post-quantum cryptography protocols executed successfully
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                  <InboxIcon />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Awaiting verification</p>
                <p className="text-xs text-gray-400">Click "Verify Signature" to authenticate the message</p>
                {!allReady && (
                  <p className="mt-3 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-full">
                    Complete Phases 1–6 to prepare verification inputs
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Section 4: How it works ── */}
        <div className="px-6 py-4 bg-purple-50 border-t border-purple-100">
          <div className="flex items-start gap-2.5">
            <span className="text-purple-500 mt-0.5 flex-shrink-0"><InfoIcon /></span>
            <div>
              <p className="text-xs font-semibold text-purple-800 mb-0.5">Dilithium Verification</p>
              <p className="text-xs text-purple-700 leading-relaxed">
                <span className="font-medium">Step 10</span> — The receiver verifies the signature using the sender's public key.
                If valid, it proves the message was signed by the holder of the corresponding private key and hasn't been tampered with.
                This completes the post-quantum secure communication channel.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}