import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons ────────────────────────────────────────────────────────────────────

const SignIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="4"/><path d="m10.85 12.15 5.65-5.65"/><path d="m16 7 1 1"/><path d="m18 5 1 1"/>
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
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

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputCard({ label, tag, tagColor, children }) {
  const tagStyles = {
    blue:   "bg-blue-50 text-blue-700 border border-blue-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
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

function PackageField({ label, icon, value, colorScheme }) {
  const schemes = {
    amber:  { card: "border-amber-200", iconBg: "bg-amber-50 text-amber-600", label: "text-amber-700" },
    green:  { card: "border-green-200", iconBg: "bg-green-50 text-green-600", label: "text-green-700" },
    purple: { card: "border-purple-200", iconBg: "bg-purple-50 text-purple-600", label: "text-purple-700" },
  };
  const s = schemes[colorScheme];
  return (
    <div className={`bg-white rounded-lg border p-3 ${s.card}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`p-1 rounded ${s.iconBg}`}>{icon}</span>
        <span className={`text-xs font-semibold ${s.label}`}>{label}</span>
      </div>
      <p className="font-mono text-[11px] text-gray-600 break-all leading-relaxed">{value}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Phase3DigitalSignature({
  message,
  signing,
  signatureProcessing,
  signature,
  handleSignMessage,
  encryptedMessage,
  iv,
  kyberCiphertext,
  sender,
}) {
  const busy = signing || signatureProcessing;
  const allReady = encryptedMessage && iv && signature;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-purple-300" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-purple-600">Phase 3</span>
          <div className="h-px w-8 bg-purple-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Digital Signature</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Sign your message using the Dilithium post-quantum algorithm to ensure authenticity and non-repudiation
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        {/* ── Section 1: Signature Control ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><SignIcon /></div>
            <h3 className="text-sm font-semibold text-gray-800">Signature Generation</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Prereqs */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${message ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                <span className="text-xs text-gray-600">Message ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs text-gray-600">Private key loaded</span>
              </div>
            </div>

            {/* Sign button */}
            <button
              onClick={handleSignMessage}
              disabled={!message || busy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap ${
                busy
                  ? "bg-purple-400 cursor-not-allowed"
                  : !message
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 active:scale-95"
              }`}
            >
              {signing ? (
                <><Spinner /> Preparing…</>
              ) : signatureProcessing ? (
                <><Spinner /> Signing with Dilithium…</>
              ) : (
                <><SignIcon /> Generate Signature</>
              )}
            </button>
          </div>

          {!message && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600"><WarnIcon /></span>
              <span className="text-xs text-amber-700">
                Please enter a message in Phase 2 before signing
              </span>
            </div>
          )}
        </div>

        {/* ── Section 2: Signing Visualization ── */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-4 text-center">
            Signing Process
          </p>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            {/* Input — Message */}
            <motion.div
              animate={signing ? { x: 24, scale: 1.03 } : { x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <InputCard label="Input" tag="message" tagColor="blue">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-blue-50 rounded text-blue-600 mt-0.5 flex-shrink-0">
                    <MessageIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Message to sign</p>
                    <p className="text-sm text-gray-800 break-words leading-relaxed">
                      {message
                        ? `"${message}"`
                        : <span className="text-gray-400 italic text-xs">No message entered</span>
                      }
                    </p>
                    {message && (
                      <span className="inline-block mt-1.5 text-[9px] font-semibold bg-blue-500 text-white px-1.5 py-0.5 rounded">
                        SHA-3
                      </span>
                    )}
                  </div>
                </div>
              </InputCard>
            </motion.div>

            {/* Center — Dilithium vessel */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-28 h-20 rounded-xl bg-white border-2 flex flex-col items-center justify-center overflow-hidden relative"
                animate={
                  signing
                    ? { borderColor: "#8b5cf6", scale: [1, 1.06, 1] }
                    : signatureProcessing
                    ? { borderColor: "#f59e0b" }
                    : { borderColor: "#e5e7eb", scale: 1 }
                }
                transition={{ duration: 1.2, repeat: signing ? Infinity : 0 }}
              >
                {signatureProcessing && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
                <div className="relative z-10 text-center px-2">
                  <div className="text-lg mb-0.5">
                    {signatureProcessing ? "🔏" : signing ? "🔄" : "⚡"}
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                    {signatureProcessing ? "Signing" : signing ? "Preparing" : "Dilithium"}
                  </div>
                </div>
              </motion.div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-px h-3 bg-gray-300" />
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-300" />
              </div>

              {/* Status badge */}
              <AnimatePresence mode="wait">
                {signing && (
                  <motion.div key="signing" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-full">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-medium text-purple-600">Preparing…</span>
                  </motion.div>
                )}
                {signatureProcessing && (
                  <motion.div key="processing" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
                    <Spinner />
                    <span className="text-[10px] font-medium text-amber-700">Computing…</span>
                  </motion.div>
                )}
                {!busy && signature && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                    <span className="text-green-600"><CheckIcon /></span>
                    <span className="text-[10px] font-medium text-green-700">Signed</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input — Dilithium Private Key */}
            <motion.div
              animate={signing ? { x: -24, scale: 1.03 } : { x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <InputCard label="Key Material" tag="secret" tagColor="purple">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-purple-50 rounded text-purple-600 mt-0.5 flex-shrink-0">
                    <KeyIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Dilithium private key</p>
                    <p className="font-mono text-[11px] text-gray-700 break-all leading-relaxed">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                        {sender.dilithiumPrivate}
                      </span>
                    </p>
                  </div>
                </div>
              </InputCard>
            </motion.div>
          </div>
        </div>

        {/* ── Section 3: Signature Output ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><SignIcon /></div>
            <h3 className="text-sm font-semibold text-gray-800">Digital Signature Output</h3>
            {signature && (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                <CheckIcon /> Ready
              </span>
            )}
          </div>

          <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${
            signature ? "border-purple-200" : "border-gray-200 border-dashed"
          }`}>
            {signature ? (
              <div>
                <div className="flex items-center justify-between px-3 py-2 bg-purple-50 border-b border-purple-100">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {["bg-purple-500","bg-pink-500","bg-indigo-500"].map((c,i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${c}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500">Dilithium signature (hex)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">384-bit security</span>
                    <button
                      onClick={() => navigator.clipboard?.writeText(signature)}
                      className="flex items-center gap-1 text-[10px] text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <CopyIcon /> Copy
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="font-mono text-xs text-gray-700 break-all leading-relaxed">{signature}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse" />
                <span className="text-xs">Click "Generate Signature" to create a Dilithium signature</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 4: Complete Transmission Package ── */}
        <AnimatePresence>
          {allReady && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-5 border-b border-green-100 bg-green-50"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
                  <CheckIcon size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-800">Transmission Package Ready</h3>
                  <p className="text-xs text-green-600">All cryptographic components for secure transmission are available</p>
                </div>
                <span className="ml-auto text-[10px] bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full font-medium">
                  Step 6 ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <PackageField
                  label="Kyber Ciphertext"
                  icon={<LockIcon />}
                  value={kyberCiphertext}
                  colorScheme="amber"
                />
                <PackageField
                  label="Encrypted Message"
                  icon={<LockIcon />}
                  value={encryptedMessage}
                  colorScheme="green"
                />
                <PackageField
                  label="Digital Signature"
                  icon={<SignIcon />}
                  value={signature}
                  colorScheme="purple"
                />
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-200 rounded-full">
                  <KeyIcon />
                  <span className="text-xs text-amber-700 font-medium">IV: {iv}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Section 5: How it works ── */}
        <div className="px-6 py-4 bg-purple-50 border-t border-purple-100">
          <div className="flex items-start gap-2.5">
            <span className="text-purple-500 mt-0.5 flex-shrink-0"><InfoIcon /></span>
            <div>
              <p className="text-xs font-semibold text-purple-800 mb-0.5">Dilithium Signature Algorithm</p>
              <p className="text-xs text-purple-700 leading-relaxed">
                <span className="font-medium text-blue-700">Step 5</span> — The message hash and Dilithium private key are combined using{" "}
                <span className="font-medium">CRYSTALS-Dilithium</span>, a post-quantum signature scheme, to produce a unique digital signature.
                It can be verified later with the corresponding public key to confirm authenticity and integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}