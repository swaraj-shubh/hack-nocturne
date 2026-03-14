import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineKey } from "react-icons/hi";
import { Button } from "@/components/ui/button";

export default function Playground() {
  const [connected, setConnected] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [kyberCiphertext, setKyberCiphertext] = useState(null);
  const [sharedSecret, setSharedSecret] = useState(null);

  // Step 3 & 4 states
  const [message, setMessage] = useState("Hello");
  const [mixing, setMixing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [encryptedMessage, setEncryptedMessage] = useState(null);
  const [iv, setIv] = useState(null);
// Add these state variables with the existing ones
const [signing, setSigning] = useState(false);
const [signatureProcessing, setSignatureProcessing] = useState(false);
const [signature, setSignature] = useState(null);
// Add these state variables with the existing ones
const [transmitting, setTransmitting] = useState(false);
const [transmitted, setTransmitted] = useState(false);
// Add these state variables with the existing ones
const [decapsulating, setDecapsulating] = useState(false);
const [decryptedMessage, setDecryptedMessage] = useState(null);
const [verifying, setVerifying] = useState(false);
const [verificationResult, setVerificationResult] = useState(null);

// Add these functions with the existing functions
// Step 7 & 8: Decapsulation
async function handleDecapsulate() {
  if (!kyberCiphertext) {
    alert("No ciphertext received for decapsulation.");
    return;
  }
  
  setDecapsulating(true);
  setSharedSecret(null);

  // Animation: Move ciphertext and private key to center
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Decapsulation stage
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Produce shared secret via decapsulation
  setSharedSecret(mockHex("shared-secret-recovered", 16));
  setDecapsulating(false);
}

// Step 9: AES-GCM Decryption
async function handleDecryptMessage() {
  if (!sharedSecret || !encryptedMessage || !iv) {
    alert("Need shared secret, encrypted message, and IV for decryption.");
    return;
  }
  
  setDecryptedMessage(null);
  setProcessing(true);

  // Animation: Move shared secret, encrypted message, and IV to center
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Decryption processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Produce decrypted message
  setDecryptedMessage(message); // In real scenario, this would be actual decryption
  setProcessing(false);
}

// Step 10: Signature Verification
async function handleVerifySignature() {
  if (!decryptedMessage || !signature) {
    alert("Need decrypted message and signature for verification.");
    return;
  }
  
  setVerifying(true);
  setVerificationResult(null);

  // Animation: Move message, signature, and public key to center
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Verification processing
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Mock verification result (always true in this demo)
  setVerificationResult(true);
  setVerifying(false);
}
// Add this function with the existing functions
// Step 6: Transmission
async function handleTransmit() {
  if (!kyberCiphertext || !encryptedMessage || !iv || !signature) {
    alert("Please complete all previous steps first.");
    return;
  }
  
  setTransmitting(true);
  setTransmitted(false);

  // Simulate transmission time
  await new Promise(resolve => setTimeout(resolve, 3000));

  setTransmitting(false);
  setTransmitted(true);
}

// Add this function with the existing functions
// Step 5: Dilithium Signing
async function handleSignMessage() {
  if (!message) {
    alert("Please enter a message to sign.");
    return;
  }
  
  setSignature(null);
  setSigning(true);
  setSignatureProcessing(false);

  // Animation: Move message and private key to center
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Signing stage
  await new Promise(resolve => setTimeout(resolve, 900));
  setSigning(false);

  // Signature creation
  setSignatureProcessing(true);
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Produce mocked signature
  setSignature(mockHex("dilithium-signature", 32));
  setSignatureProcessing(false);
}
  const sender = {
    name: "Sender",
    kyberPublic: "kyb-pub-0xA1B2...F3",
    dilithiumPublic: "dil-pub-0xC4D5...E6",
    kyberPrivate: "kyb-priv-0x11AA...22",
    dilithiumPrivate: "dil-priv-0x3344...55",
  };

  const receiver = {
    name: "Receiver",
    kyberPublic: "kyb-pub-0x9F8E...01",
    dilithiumPublic: "dil-pub-0x7B6C...2A",
    kyberPrivate: "kyb-priv-0x99EE...AA",
    dilithiumPrivate: "dil-priv-0x1234...56",
  };

  function mockHex(label, length = 16) {
    const random = () => Math.floor(Math.random() * 16).toString(16).toUpperCase();
    return `${label}-0x` + Array.from({ length }).map(random).join("");
  }

  function handleConnect() {
    if (animating) return;
    setConnected(false);
    setKyberCiphertext(null);
    setSharedSecret(null);
    setAnimating(true);

    setTimeout(() => setConnected(true), 900);
    setTimeout(() => setKyberCiphertext(mockHex("kyber-ciphertext")), 1700);
    setTimeout(() => {
      setSharedSecret(mockHex("shared-secret"));
      setAnimating(false);
    }, 2400);
  }

  // Step 3 & 4: Message mixing and AES-GCM encryption
  async function handleMixAndEncrypt() {
    if (!sharedSecret) {
      alert("First complete key exchange to get shared secret.");
      return;
    }
    
    // Reset previous outputs
    setEncryptedMessage(null);
    setIv(null);
    setMixing(true);
    setProcessing(false);

    // Animation: Move message and shared secret to center
    await new Promise(resolve => setTimeout(resolve, 900));
    
    // Mixing stage
    await new Promise(resolve => setTimeout(resolve, 900));
    setMixing(false);

    // Step 4: AES-GCM processing
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Produce mocked encrypted message and IV
    setIv(mockHex("iv", 8));
    setEncryptedMessage(mockHex("enc-msg", 20));
    setProcessing(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 p-8 flex flex-col gap-8">
      <header className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Post-Quantum Chat — Visual Playground</h1>
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen">

{/* Step 1 & 2: Key Exchange */}
<div className="w-full max-w-7xl relative mb-20">
  {/* Section Header with decorative elements */}
  <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center gap-3 mb-3">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400"></div>
      <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Phase 1</span>
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400"></div>
    </div>
    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
      Key Exchange
    </h2>
    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
      Establish a secure shared secret using Kyber post-quantum key encapsulation
    </p>
  </div>

  {/* Sender Card - Left */}
  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80">
    <div className="group relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Decorative gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t-2xl"></div>
      
      {/* Card Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:scale-110 transition-transform duration-300">
            <HiOutlineKey size={28} className="text-blue-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <div className="text-xl font-bold text-gray-800">{sender.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">encryption</span>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">signing</span>
          </div>
        </div>
      </div>

      {/* Key Details */}
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kyber Public</span>
            <span className="text-[10px] text-gray-400">encryption key</span>
          </div>
          <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200 break-all">
            {sender.kyberPublic}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kyber Private</span>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">secret</span>
          </div>
          <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200">
            {sender.kyberPrivate}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dilithium Private</span>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">secret</span>
          </div>
          <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200">
            {sender.dilithiumPrivate}
          </div>
        </div>
      </div>

      {/* Key indicator */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
    </div>
  </div>

  {/* Receiver Card - Right */}
  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80">
    <div className="group relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Decorative gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-2xl"></div>
      
      {/* Card Header */}
      <div className="flex items-center gap-4 mb-5 justify-end">
        <div className="text-right">
          <div className="text-xl font-bold text-gray-800">{receiver.name}</div>
          <div className="flex items-center gap-2 mt-1 justify-end">
            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs font-medium rounded-full">decryption</span>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">verification</span>
          </div>
        </div>
        <div className="relative">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 group-hover:scale-110 transition-transform duration-300">
            <HiOutlineKey size={28} className="text-green-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Key Details */}
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kyber Public</span>
            <span className="text-[10px] text-gray-400">encryption key</span>
          </div>
          <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200">
            {receiver.kyberPublic}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kyber Private</span>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">secret</span>
          </div>
          <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200">
            {receiver.kyberPrivate}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dilithium Public</span>
            <span className="text-[10px] text-gray-400">verification key</span>
          </div>
          <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200">
            {receiver.dilithiumPublic}
          </div>
        </div>
      </div>

      {/* Key indicator */}
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
    </div>
  </div>

  {/* Center Section - Connection & Status */}
  <div className="w-full flex flex-col items-center justify-center min-h-[300px]">
    {/* Connection Control */}
    <div className="relative z-10 mb-8">
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={handleConnect}
          disabled={animating}
          className={`group relative px-8 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 ${
            animating 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {animating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <HiOutlineKey size={20} />
                <span>Connect & Exchange Public Keys</span>
              </>
            )}
          </span>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm font-medium text-gray-600">
            {connected ? 'Secure Connection Established' : 'Awaiting Connection'}
          </span>
        </div>
      </div>
    </div>

    {/* Animation Area */}
    <div className="relative w-full max-w-4xl h-48 flex items-center justify-center">
      {/* Connection Line with Gradient */}
      <div className="absolute left-1/4 right-1/4 top-1/2 h-0.5">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-gray-300 to-green-200"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Animated Key Exchange */}
      <AnimatePresence>
        {animating && (
          <>
            {/* Sender's Public Key Animation */}
            <motion.div
              className="absolute right-1/3 top-1/2 -translate-y-1/2 z-20"
              initial={{ x: 0, opacity: 0, scale: 0.8 }}
              animate={{ x: "-100%", opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-xl border border-blue-100">
                <div className="p-1.5 bg-blue-50 rounded-full">
                  <HiOutlineKey size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-mono text-blue-600">kyber-public-key</span>
                <motion.div 
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Receiver's Public Key Animation */}
            <motion.div
              className="absolute left-1/3 top-1/2 -translate-y-1/2 z-20"
              initial={{ x: 0, opacity: 0, scale: 0.8 }}
              animate={{ x: "100%", opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-xl border border-green-100">
                <div className="p-1.5 bg-green-50 rounded-full">
                  <HiOutlineKey size={16} className="text-green-600" />
                </div>
                <span className="text-sm font-mono text-green-600">kyber-public-key</span>
                <motion.div 
                  className="w-1.5 h-1.5 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Status Panel */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%]">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Panel Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange Status</span>
              <span className="text-xs text-gray-400">Step 1/2</span>
            </div>
          </div>
          
          {/* Panel Content */}
          <div className="p-4 grid grid-cols-3 gap-4">
            {/* Ciphertext */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-amber-50 rounded">
                  <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600">Kyber Ciphertext</span>
              </div>
              <div className={`font-mono text-xs p-3 rounded-lg transition-all duration-300 ${
                kyberCiphertext 
                  ? 'bg-amber-50 border border-amber-200 text-amber-700 shadow-sm' 
                  : 'bg-gray-50 text-gray-400 border border-gray-200'
              }`}>
                {kyberCiphertext || (
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-300 rounded-full animate-pulse"></span>
                    waiting for exchange...
                  </span>
                )}
              </div>
            </div>

            {/* Shared Secret */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-green-50 rounded">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600">Shared Secret</span>
              </div>
              <div className={`font-mono text-xs p-3 rounded-lg transition-all duration-300 ${
                sharedSecret 
                  ? 'bg-green-50 border border-green-200 text-green-700 shadow-sm' 
                  : 'bg-gray-50 text-gray-400 border border-gray-200'
              }`}>
                {sharedSecret || (
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-300 rounded-full animate-pulse"></span>
                    waiting for exchange...
                  </span>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-blue-50 rounded">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600">Status</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                {animating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></div>
                    <span className="text-xs font-medium text-amber-600">Performing encapsulation...</span>
                  </div>
                ) : connected ? (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-600">Keys exchanged ✓</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-400">Idle</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer Note */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">
              <span className="font-medium">Note:</span> Values are simulated for demonstration purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Step 3 & 4: Message Mixing & AES-GCM Encryption */}
<div className="w-full max-w-5xl mt-20">
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    {/* Section Header with decorative elements */}
    <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      <div className="relative">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400"></div>
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Phase 2</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Message Encryption</h2>
        <p className="text-gray-500 max-w-2xl">
          Combine the shared secret with your message and encrypt it using AES-GCM for confidentiality
        </p>
      </div>
    </div>

    <div className="p-8">
      {/* Input Section - Redesigned */}
      <div className="mb-12">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Message Input</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Enter the message you want to encrypt:
              </label>
              <div className="relative">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
                  placeholder="Type your secret message here..."
                />
                {message && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600">ready</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              onClick={handleMixAndEncrypt} 
              disabled={!sharedSecret || mixing || processing}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {mixing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Mixing...</span>
                  </>
                ) : processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Encrypting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Mix & Encrypt</span>
                  </>
                )}
              </span>
            </Button>
          </div>
          
          {!sharedSecret && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-amber-700">Complete key exchange first to get shared secret</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation Section - Redesigned */}
      <div className="relative mb-16">
        <h3 className="text-sm font-medium text-gray-500 mb-6 text-center">Encryption Process Visualization</h3>
        
        <div className="relative h-64 flex items-center justify-center">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent rounded-3xl"></div>
          
          {/* Connection Path with animated dots */}
          <div className="absolute left-1/4 right-1/4 top-1/2">
            <div className="relative">
              <div className="absolute inset-0 h-0.5 bg-gradient-to-r from-green-200 via-blue-200 to-blue-200"></div>
              <motion.div 
                className="absolute top-1/2 left-0 w-2 h-2 bg-blue-500 rounded-full"
                animate={mixing || processing ? {
                  left: ["0%", "100%", "0%"],
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Shared Secret (Left) */}
          <motion.div
            className="absolute left-[15%] top-1/2 -translate-y-1/2 z-10"
            animate={mixing ? { x: 120, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-green-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-green-200 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Input A</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">Shared Secret</div>
                <div className="font-mono text-xs bg-green-50 p-2 rounded-lg border border-green-200 text-gray-700 truncate">
                  {sharedSecret ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {sharedSecret.substring(0, 20)}...
                    </span>
                  ) : "-- waiting --"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Message (Right) */}
          <motion.div
            className="absolute right-[15%] top-1/2 -translate-y-1/2 z-10"
            animate={mixing ? { x: -120, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-blue-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-blue-200 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Input B</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">Plaintext Message</div>
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 font-medium break-words">"{message}"</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mixing Vessel (Center) */}
          <div className="relative z-20">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-56 h-28 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 shadow-xl flex items-center justify-center overflow-hidden"
                animate={mixing ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0],
                  borderColor: ["#e5e7eb", "#3b82f6", "#10b981", "#e5e7eb"]
                } : processing ? {
                  scale: 1,
                  borderColor: "#f59e0b",
                  boxShadow: "0 0 20px rgba(245,158,11,0.3)"
                } : {
                  scale: 1,
                  borderColor: "#e5e7eb"
                }}
                transition={{ duration: mixing ? 1.6 : 0.6 }}
              >
                {/* Animated background for processing state */}
                {processing && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                
                <div className="relative text-center z-10">
                  <div className="text-sm font-bold text-gray-700 mb-1">
                    {processing ? '🔐 ENCRYPTING' : mixing ? '🔄 MIXING' : '⚗️ MIXING VESSEL'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <span>AES-GCM</span>
                    {processing && (
                      <>
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-ping"></span>
                        <span className="text-amber-600">processing</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Processing Animation */}
              <AnimatePresence>
                {processing && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-full border border-amber-200"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin"></div>
                    </div>
                    <span className="text-sm font-medium text-amber-700">AES-GCM Encryption in progress...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {!processing && encryptedMessage && iv && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-full"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-green-200 rounded-full">
                          <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-green-700">Encryption Successful!</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-lg border border-green-200">
                          <div className="text-xs text-gray-500 mb-1">Encrypted Message</div>
                          <div className="font-mono text-xs text-gray-700 break-all">{encryptedMessage}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-amber-200">
                          <div className="text-xs text-gray-500 mb-1">Initialization Vector (IV)</div>
                          <div className="font-mono text-xs text-gray-700 break-all">{iv}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Output Display - Redesigned */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="group">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Encrypted Message</span>
            {encryptedMessage && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">ready</span>
            )}
          </div>
          <div className={`relative p-4 rounded-xl border-2 transition-all ${
            encryptedMessage 
              ? 'bg-green-50 border-green-300 shadow-md' 
              : 'bg-gray-50 border-gray-200 border-dashed'
          }`}>
            {encryptedMessage ? (
              <div className="font-mono text-sm text-gray-700 break-all">{encryptedMessage}</div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">等待加密完成</span>
              </div>
            )}
          </div>
        </div>

        <div className="group">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Initialization Vector (IV)</span>
            {iv && (
              <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">ready</span>
            )}
          </div>
          <div className={`relative p-4 rounded-xl border-2 transition-all ${
            iv 
              ? 'bg-amber-50 border-amber-300 shadow-md' 
              : 'bg-gray-50 border-gray-200 border-dashed'
          }`}>
            {iv ? (
              <div className="font-mono text-sm text-gray-700 break-all">{iv}</div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">等待加密完成</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Process Explanation */}
      <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">How it works</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-green-600">Step 3:</span> The shared secret and your message are mixed together in the encryption vessel → 
              <span className="font-medium text-amber-600 ml-1">Step 4:</span> AES-GCM encryption generates an encrypted message and a unique Initialization Vector (IV) for security
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Step 5: Dilithium Signing */}
<div className="w-full max-w-5xl mt-20">
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    {/* Section Header with decorative elements */}
    <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      <div className="relative">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400"></div>
          <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Phase 3</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Digital Signature (Dilithium)</h2>
        <p className="text-gray-500 max-w-2xl">
          Sign your message using the Dilithium post-quantum signature algorithm to ensure authenticity and non-repudiation
        </p>
      </div>
    </div>

    <div className="p-8">
      {/* Signing Control - Redesigned */}
      <div className="mb-12">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-200 rounded-lg">
              <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Signature Generation</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Ready indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${message ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-600">Message ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Private key loaded</span>
              </div>
            </div>
            
            <Button 
              onClick={handleSignMessage} 
              disabled={!message || signing || signatureProcessing}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[220px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {signing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Preparing signature...</span>
                  </>
                ) : signatureProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing with Dilithium...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span>Generate Signature</span>
                  </>
                )}
              </span>
            </Button>
          </div>

          {!message && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-amber-700">Please enter a message to sign in Step 3</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signing Animation Section - Redesigned */}
      <div className="relative mb-16">
        <h3 className="text-sm font-medium text-gray-500 mb-6 text-center">Signature Generation Process</h3>
        
        <div className="relative h-64 flex items-center justify-center">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/30 to-transparent rounded-3xl"></div>
          
          {/* Connection Path with animated dots */}
          <div className="absolute left-1/4 right-1/4 top-1/2">
            <div className="relative">
              <div className="absolute inset-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200"></div>
              <motion.div 
                className="absolute top-1/2 left-0 w-2 h-2 bg-purple-500 rounded-full"
                animate={signing || signatureProcessing ? {
                  left: ["0%", "100%", "0%"],
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Message (Left) */}
          <motion.div
            className="absolute left-[15%] top-1/2 -translate-y-1/2 z-10"
            animate={signing ? { x: 100, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-blue-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-blue-200 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Input</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">Message to Sign</div>
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 font-medium break-words">"{message}"</p>
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="px-2 py-0.5 bg-blue-500 text-white text-[10px] rounded-full">SHA-3</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dilithium Private Key (Right) */}
          <motion.div
            className="absolute right-[15%] top-1/2 -translate-y-1/2 z-10"
            animate={signing ? { x: -100, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-purple-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-purple-200 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Key Material</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">Dilithium Private Key</div>
                <div className="font-mono text-xs bg-purple-50 p-2 rounded-lg border border-purple-200 text-gray-700">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    {sender.dilithiumPrivate}
                  </span>
                </div>
                <div className="absolute -top-2 -left-2">
                  <div className="px-2 py-0.5 bg-amber-500 text-white text-[10px] rounded-full">SECRET</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Signing Vessel (Center) */}
          <div className="relative z-20">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-56 h-28 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 shadow-xl flex items-center justify-center overflow-hidden"
                animate={signing ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, -2, 2, 0],
                  borderColor: ["#e5e7eb", "#8b5cf6", "#a855f7", "#e5e7eb"]
                } : signatureProcessing ? {
                  scale: 1,
                  borderColor: "#f59e0b",
                  boxShadow: "0 0 20px rgba(245,158,11,0.3)"
                } : {
                  scale: 1,
                  borderColor: "#e5e7eb"
                }}
                transition={{ duration: signing ? 1.6 : 0.6 }}
              >
                {/* Animated background for processing state */}
                {signatureProcessing && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                
                <div className="relative text-center z-10">
                  <div className="text-sm font-bold text-gray-700 mb-1">
                    {signatureProcessing ? '🔏 GENERATING' : signing ? '🔄 PREPARING' : '⚡ DILITHIUM'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <span>Post-Quantum Signing</span>
                    {signatureProcessing && (
                      <>
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-ping"></span>
                        <span className="text-amber-600">active</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Signature Processing Animation */}
              <AnimatePresence>
                {signatureProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-full border border-purple-200"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full border-2 border-purple-300 border-t-purple-600 animate-spin"></div>
                    </div>
                    <span className="text-sm font-medium text-purple-700">Computing Dilithium signature...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Signature Results */}
              <AnimatePresence>
                {!signatureProcessing && signature && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full"
                  >
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-purple-200 rounded-full">
                          <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">Signature Generated Successfully!</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">Dilithium Signature</span>
                          <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">384-bit security</span>
                        </div>
                        <div className="font-mono text-xs text-gray-700 break-all bg-gray-50 p-2 rounded">
                          {signature}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Output Display - Redesigned */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">Digital Signature Output</span>
          {signature && (
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">ready</span>
          )}
        </div>
        <div className={`relative p-4 rounded-xl border-2 transition-all ${
          signature 
            ? 'bg-purple-50 border-purple-300 shadow-md' 
            : 'bg-gray-50 border-gray-200 border-dashed'
        }`}>
          {signature ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">Dilithium signature (hex)</span>
                </div>
                <button className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <div className="font-mono text-sm text-gray-700 break-all bg-white p-3 rounded-lg border border-purple-200">
                {signature}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm">Click "Generate Signature" to create a Dilithium signature</span>
            </div>
          )}
        </div>
      </div>

      {/* Final Package Display - Enhanced */}
      {(encryptedMessage && iv && signature) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-200 rounded-full">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-700">🎉 Complete Transmission Package Ready!</h3>
              <p className="text-green-600 text-sm">All cryptographic components for secure transmission are now available</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kyber Ciphertext */}
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-amber-100 rounded">
                  <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-amber-700">Kyber Ciphertext</span>
              </div>
              <div className="font-mono text-xs text-gray-600 break-all">{kyberCiphertext}</div>
            </div>

            {/* Encrypted Message */}
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-green-100 rounded">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-green-700">Encrypted Message</span>
              </div>
              <div className="font-mono text-xs text-gray-600 break-all">{encryptedMessage}</div>
            </div>

            {/* Digital Signature */}
            <div className="bg-white p-3 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-purple-100 rounded">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-purple-700">Digital Signature</span>
              </div>
              <div className="font-mono text-xs text-gray-600 break-all">{signature}</div>
            </div>
          </div>

          {/* IV Display */}
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="text-xs font-medium text-amber-700">IV: {iv}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>All components ready for transmission (Step 6)</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Process Explanation */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-200 rounded-lg">
            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Dilithium Signature Algorithm</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Step 5:</span> The message hash and Dilithium private key are combined using the 
              <span className="font-medium text-purple-600"> CRYSTALS-Dilithium</span> post-quantum signature algorithm to create a unique digital signature. 
              This signature can later be verified using the corresponding public key to ensure message authenticity and integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Step 6: Secure Transmission */}
<div className="w-full max-w-5xl mt-20">
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    {/* Section Header with decorative elements */}
    <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      <div className="relative">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-400"></div>
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Phase 4</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-400"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Secure Transmission</h2>
        <p className="text-gray-500 max-w-2xl">
          Transmit the complete cryptographic package to the receiver through a secure communication channel
        </p>
      </div>
    </div>

    <div className="p-8">
      {/* Transmission Control - Redesigned */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-200 rounded-lg">
              <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4-4m-4 4l4 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Transmission Control</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Package Status Indicators */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${kyberCiphertext ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">Kyber</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${encryptedMessage ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${iv ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">IV</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${signature ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">Signature</span>
              </div>
            </div>
            
            <Button 
              onClick={handleTransmit} 
              disabled={!kyberCiphertext || !encryptedMessage || !iv || !signature || transmitting}
              className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {transmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Transmit Package</span>
                  </>
                )}
              </span>
            </Button>
          </div>

          {/* Readiness Warning */}
          {(!kyberCiphertext || !encryptedMessage || !iv || !signature) && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-amber-700">Complete steps 1-5 to generate all required components</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transmission Animation Section */}
      <div className="relative min-h-[500px] flex flex-col items-center justify-between py-8">
        {/* Sender Section */}
        <div className="w-full max-w-3xl mb-8">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 mx-auto shadow-xl">
                  <HiOutlineKey size={28} />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                  Encryption
                </div>
              </div>
              <div className="text-lg font-bold text-gray-800">Sender</div>
              <div className="text-xs text-gray-500">Alice</div>
            </div>

            {/* Connection indicator */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-300 to-green-300"></div>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white mb-3 mx-auto shadow-xl">
                  <HiOutlineKey size={28} />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  Decryption
                </div>
              </div>
              <div className="text-lg font-bold text-gray-800">Receiver</div>
              <div className="text-xs text-gray-500">Bob</div>
            </div>
          </div>

          {/* Package Components Display */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">Outgoing Package</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">4 components</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-500">ready for transmission</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Kyber Ciphertext */}
              <motion.div
                className="relative group"
                animate={transmitting ? { opacity: 0.6, scale: 0.95 } : { opacity: 1, scale: 1 }}
              >
                <div className="absolute inset-0 bg-amber-400 rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-white rounded-xl p-3 border-2 border-amber-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">KEM</span>
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Kyber Ciphertext</div>
                  <div className="font-mono text-[10px] text-gray-500 truncate">
                    {kyberCiphertext ? kyberCiphertext.substring(0, 20) + '...' : '-- waiting --'}
                  </div>
                  {kyberCiphertext && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
              </motion.div>

              {/* Encrypted Message */}
              <motion.div
                className="relative group"
                animate={transmitting ? { opacity: 0.6, scale: 0.95 } : { opacity: 1, scale: 1 }}
              >
                <div className="absolute inset-0 bg-green-400 rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-white rounded-xl p-3 border-2 border-green-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono bg-green-50 text-green-600 px-1.5 py-0.5 rounded">AES</span>
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Encrypted Msg</div>
                  <div className="font-mono text-[10px] text-gray-500 truncate">
                    {encryptedMessage ? encryptedMessage.substring(0, 20) + '...' : '-- waiting --'}
                  </div>
                  {encryptedMessage && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
              </motion.div>

              {/* IV */}
              <motion.div
                className="relative group"
                animate={transmitting ? { opacity: 0.6, scale: 0.95 } : { opacity: 1, scale: 1 }}
              >
                <div className="absolute inset-0 bg-amber-400 rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-white rounded-xl p-3 border-2 border-amber-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">IV</span>
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Initialization Vector</div>
                  <div className="font-mono text-[10px] text-gray-500 truncate">
                    {iv ? iv.substring(0, 20) + '...' : '-- waiting --'}
                  </div>
                  {iv && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
              </motion.div>

              {/* Signature */}
              <motion.div
                className="relative group"
                animate={transmitting ? { opacity: 0.6, scale: 0.95 } : { opacity: 1, scale: 1 }}
              >
                <div className="absolute inset-0 bg-purple-400 rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-white rounded-xl p-3 border-2 border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">Dilithium</span>
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Signature</div>
                  <div className="font-mono text-[10px] text-gray-500 truncate">
                    {signature ? signature.substring(0, 20) + '...' : '-- waiting --'}
                  </div>
                  {signature && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Transmission Path & Animations */}
        <div className="relative w-full max-w-lg my-8">
          {/* Transmission Line with gradient */}
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-40 bg-gradient-to-b from-blue-400 via-indigo-400 to-green-400 rounded-full">
            {/* Animated dots along the line */}
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
              animate={transmitting ? {
                top: ["0%", "100%"],
              } : {}}
              transition={{ duration: 3, repeat: transmitting ? Infinity : 0, ease: "linear" }}
            />
          </div>
          
          {/* Transmission Animations */}
          <div className="relative h-48">
            <AnimatePresence>
              {transmitting && (
                <>
                  {/* Kyber Ciphertext Transmission */}
                  <motion.div
                    key="kyber-transmit"
                    className="absolute left-1/2 -translate-x-1/2"
                    initial={{ top: "0%", opacity: 0, x: -50 }}
                    animate={{ top: "80%", opacity: 1, x: -50 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border-2 border-amber-300 shadow-xl">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-amber-700">kyber.cipher</span>
                    </div>
                  </motion.div>

                  {/* Encrypted Message Transmission */}
                  <motion.div
                    key="encrypted-transmit"
                    className="absolute left-1/2 -translate-x-1/2"
                    initial={{ top: "0%", opacity: 0, x: 50 }}
                    animate={{ top: "80%", opacity: 1, x: 50 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border-2 border-green-300 shadow-xl">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-green-700">encrypted.msg</span>
                    </div>
                  </motion.div>

                  {/* IV Transmission */}
                  <motion.div
                    key="iv-transmit"
                    className="absolute left-1/2 -translate-x-1/2"
                    initial={{ top: "0%", opacity: 0, x: -30 }}
                    animate={{ top: "80%", opacity: 1, x: -30 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                  >
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border-2 border-amber-300 shadow-xl">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-amber-700">iv.vector</span>
                    </div>
                  </motion.div>

                  {/* Signature Transmission */}
                  <motion.div
                    key="signature-transmit"
                    className="absolute left-1/2 -translate-x-1/2"
                    initial={{ top: "0%", opacity: 0, x: 30 }}
                    animate={{ top: "80%", opacity: 1, x: 30 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, delay: 1.0 }}
                  >
                    <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border-2 border-purple-300 shadow-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-purple-700">dilithium.sig</span>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Transmission Status */}
            <AnimatePresence>
              {transmitting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="flex items-center gap-3 bg-indigo-50 px-6 py-3 rounded-full border-2 border-indigo-300 shadow-xl">
                    <div className="relative">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-indigo-700">Secure transmission in progress...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Receiver Section */}
        <div className="w-full max-w-3xl mt-8">
          {/* Received Package Display */}
          <AnimatePresence>
            {transmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-green-700">Package Received Successfully!</h4>
                    <p className="text-green-600 text-sm">All 4 components have been securely transmitted</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">Kyber Ciphertext</span>
                    </div>
                    <div className="font-mono text-[10px] text-gray-500 truncate">{kyberCiphertext}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">Encrypted Message</span>
                    </div>
                    <div className="font-mono text-[10px] text-gray-500 truncate">{encryptedMessage}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">IV</span>
                    </div>
                    <div className="font-mono text-[10px] text-gray-500 truncate">{iv}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">Signature</span>
                    </div>
                    <div className="font-mono text-[10px] text-gray-500 truncate">{signature}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 bg-green-100 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">Ready for decryption and verification</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-1">Awaiting Transmission</h4>
                <p className="text-sm text-gray-500">Package will appear here after transmission</p>
                {(!kyberCiphertext || !encryptedMessage || !iv || !signature) && (
                  <div className="mt-4 p-2 bg-amber-50 rounded-lg inline-block">
                    <p className="text-xs text-amber-600">Complete steps 1-5 to prepare package</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Transmission Summary */}
      <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Transmission Package Contents
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-xs font-semibold text-amber-700 mb-1">Kyber Ciphertext</div>
            <div className="text-[10px] text-gray-500">Key Encapsulation</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs font-semibold text-green-700 mb-1">Encrypted Message</div>
            <div className="text-[10px] text-gray-500">AES-GCM encrypted</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-xs font-semibold text-amber-700 mb-1">IV</div>
            <div className="text-[10px] text-gray-500">Initialization Vector</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs font-semibold text-purple-700 mb-1">Signature</div>
            <div className="text-[10px] text-gray-500">Dilithium signed</div>
          </div>
        </div>
      </div>

      {/* Process Explanation */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-200 rounded-lg">
            <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Secure Transmission Protocol</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600">Step 6:</span> All four cryptographic components are transmitted through a secure channel. 
              The package includes the Kyber ciphertext for key exchange, AES-GCM encrypted message with its IV, 
              and the Dilithium signature for authentication. The receiver will use these components to decrypt 
              and verify the original message.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Step 7 & 8: Key Decapsulation */}
<div className="w-full max-w-5xl mt-20">
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    {/* Section Header with decorative elements */}
    <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      <div className="relative">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400"></div>
          <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Phase 5</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Key Decapsulation</h2>
        <p className="text-gray-500 max-w-2xl">
          Recover the shared secret using Kyber ciphertext and the recipient's private key
        </p>
      </div>
    </div>

    <div className="p-8">
      {/* Decapsulation Control - Redesigned */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-200 rounded-lg">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Decapsulation Process</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Status Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${kyberCiphertext ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">Ciphertext ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Private key loaded</span>
              </div>
            </div>
            
            <Button 
              onClick={handleDecapsulate} 
              disabled={!kyberCiphertext || decapsulating}
              className="group relative px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {decapsulating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Decapsulating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span>Decapsulate (Kyber)</span>
                  </>
                )}
              </span>
            </Button>
          </div>

          {/* Missing Ciphertext Warning */}
          {!kyberCiphertext && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-amber-700">Complete key exchange (Step 1-2) to get ciphertext</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decapsulation Animation Section - Redesigned */}
      <div className="relative mb-16">
        <h3 className="text-sm font-medium text-gray-500 mb-6 text-center">Decapsulation Process Visualization</h3>
        
        <div className="relative h-64 flex items-center justify-center">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/30 to-transparent rounded-3xl"></div>
          
          {/* Connection Path with animated dots */}
          <div className="absolute left-1/4 right-1/4 top-1/2">
            <div className="relative">
              <div className="absolute inset-0 h-0.5 bg-gradient-to-r from-amber-200 via-orange-200 to-green-200"></div>
              <motion.div 
                className="absolute top-1/2 left-0 w-2 h-2 bg-amber-500 rounded-full"
                animate={decapsulating ? {
                  left: ["0%", "100%", "0%"],
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Kyber Ciphertext (Left) */}
          <motion.div
            className="absolute left-[15%] top-1/2 -translate-y-1/2 z-10"
            animate={decapsulating ? { x: 80, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-amber-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-amber-200 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Input A</span>
                  <div className="ml-auto px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] rounded-full">Kyber</div>
                </div>
                <div className="text-xs text-gray-500 mb-1">Ciphertext</div>
                <div className="font-mono text-xs bg-amber-50 p-2 rounded-lg border border-amber-200 text-gray-700">
                  {kyberCiphertext ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      {kyberCiphertext.substring(0, 30)}...
                    </span>
                  ) : (
                    <span className="text-gray-400">-- waiting for ciphertext --</span>
                  )}
                </div>
                {kyberCiphertext && (
                  <div className="absolute -top-2 -right-2">
                    <div className="px-2 py-0.5 bg-green-500 text-white text-[10px] rounded-full">ready</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Receiver Private Key (Right) */}
          <motion.div
            className="absolute right-[15%] top-1/2 -translate-y-1/2 z-10"
            animate={decapsulating ? { x: -80, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-green-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-green-200 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Input B</span>
                  <div className="ml-auto px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] rounded-full">SECRET</div>
                </div>
                <div className="text-xs text-gray-500 mb-1">Receiver Private Key</div>
                <div className="font-mono text-xs bg-green-50 p-2 rounded-lg border border-green-200 text-gray-700">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {receiver.kyberPrivate}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decapsulation Vessel (Center) */}
          <div className="relative z-20">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-56 h-28 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 shadow-xl flex items-center justify-center overflow-hidden"
                animate={decapsulating ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0],
                  borderColor: ["#e5e7eb", "#f59e0b", "#10b981", "#e5e7eb"],
                  boxShadow: ["0 4px 6px -1px rgba(0,0,0,0.1)", "0 10px 15px -3px rgba(245,158,11,0.3)", "0 10px 15px -3px rgba(16,185,129,0.3)", "0 4px 6px -1px rgba(0,0,0,0.1)"]
                } : {
                  scale: 1,
                  borderColor: "#e5e7eb"
                }}
                transition={{ duration: decapsulating ? 1.6 : 0.6 }}
              >
                {/* Animated background for decapsulating state */}
                {decapsulating && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                
                <div className="relative text-center z-10">
                  <div className="text-sm font-bold text-gray-700 mb-1">
                    {decapsulating ? '🔄 DECAPSULATING' : '⚡ KYBER'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <span>Key Decapsulation</span>
                    {decapsulating && (
                      <>
                        <span className="w-1 h-1 bg-amber-500 rounded-full animate-ping"></span>
                        <span className="text-amber-600">processing</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Processing Animation */}
              <AnimatePresence>
                {decapsulating && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-full border border-amber-200"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin"></div>
                    </div>
                    <span className="text-sm font-medium text-amber-700">Recovering shared secret via Kyber...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {sharedSecret && !decapsulating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-green-200 rounded-full">
                          <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-green-700">Shared Secret Recovered Successfully!</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">Recovered Shared Secret</span>
                          <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">256-bit</span>
                        </div>
                        <div className="font-mono text-xs text-gray-700 break-all bg-gray-50 p-2 rounded">
                          {sharedSecret}
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Identical to sender's shared secret</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Output Display - Redesigned */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">Recovered Shared Secret</span>
          {sharedSecret && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">recovered</span>
          )}
        </div>
        
        <div className={`relative p-4 rounded-xl border-2 transition-all ${
          sharedSecret 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md' 
            : 'bg-gray-50 border-gray-200 border-dashed'
        }`}>
          {sharedSecret ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full -ml-1"></div>
                  </div>
                  <span className="text-xs text-gray-500">Decapsulated secret (hex)</span>
                </div>
                <button className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <div className="font-mono text-sm text-gray-700 break-all bg-white p-3 rounded-lg border border-green-200">
                {sharedSecret}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Successfully recovered</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Ready for decryption</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm text-gray-400">Click "Decapsulate" to recover the shared secret</span>
              <span className="text-xs text-gray-400">The recovered secret will match the sender's shared secret</span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Confirmation - Key Matching */}
      {sharedSecret && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Key Establishment Complete</h4>
              <p className="text-xs text-gray-600">
                The recovered shared secret matches the sender's secret. This symmetric key will now be used for AES-GCM decryption.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Process Explanation */}
      <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-200 rounded-lg">
            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Kyber Decapsulation</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-amber-600">Step 7 & 8:</span> The receiver uses their private key to decapsulate the Kyber ciphertext, 
              recovering the identical shared secret that was generated by the sender. This process is the inverse of the key encapsulation 
              performed in Step 2, completing the post-quantum key exchange.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Step 9: AES-GCM Decryption */}
<div className="w-full max-w-5xl mt-20">
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    {/* Section Header with decorative elements */}
    <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      <div className="relative">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400"></div>
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Phase 6</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Message Decryption</h2>
        <p className="text-gray-500 max-w-2xl">
          Decrypt the ciphertext using the recovered shared secret and initialization vector
        </p>
      </div>
    </div>

    <div className="p-8">
      {/* Decryption Control - Redesigned */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-200 rounded-lg">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Decryption Process</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Status Indicators */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${sharedSecret ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">Shared Secret</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${encryptedMessage ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">Encrypted Msg</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${iv ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">IV</span>
              </div>
            </div>
            
            <Button 
              onClick={handleDecryptMessage} 
              disabled={!sharedSecret || !encryptedMessage || !iv || processing}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[220px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Decrypting with AES-GCM...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span>Decrypt Message (AES-GCM)</span>
                  </>
                )}
              </span>
            </Button>
          </div>

          {/* Missing Components Warning */}
          {(!sharedSecret || !encryptedMessage || !iv) && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-amber-700">
                  {!sharedSecret && 'Complete decapsulation (Step 7-8) to get shared secret. '}
                  {!encryptedMessage && 'Complete encryption (Step 3-4) to get encrypted message. '}
                  {!iv && 'IV is required from encryption step.'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decryption Animation Section - Redesigned */}
      <div className="relative mb-16">
        <h3 className="text-sm font-medium text-gray-500 mb-6 text-center">AES-GCM Decryption Process</h3>
        
        <div className="relative h-72 flex items-center justify-center">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent rounded-3xl"></div>
          
          {/* Connection lines with animated dots */}
          <div className="absolute inset-0">
            {/* Line from top to center */}
            <div className="absolute left-1/2 top-0 bottom-1/2 w-0.5 bg-gradient-to-b from-green-200 to-blue-200"></div>
            {/* Line from left to center */}
            <div className="absolute right-1/2 left-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-200 to-blue-300"></div>
            {/* Line from right to center */}
            <div className="absolute left-1/2 right-0 top-1/2 h-0.5 bg-gradient-to-l from-amber-200 to-amber-300"></div>
            
            {/* Animated dots */}
            {processing && (
              <>
                <motion.div 
                  className="absolute left-1/2 top-0 w-2 h-2 bg-green-500 rounded-full"
                  animate={{ top: ["0%", "50%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute left-0 top-1/2 w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ left: ["0%", "50%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.3 }}
                />
                <motion.div 
                  className="absolute right-0 top-1/2 w-2 h-2 bg-amber-500 rounded-full"
                  animate={{ right: ["0%", "50%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.6 }}
                />
              </>
            )}
          </div>

          {/* Shared Secret (Top) */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
            animate={processing ? { y: 40, scale: 1.05 } : { y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-green-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-green-200 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Key</span>
                  <div className="ml-auto px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-full">256-bit</div>
                </div>
                <div className="text-xs text-gray-500 mb-1">Shared Secret</div>
                <div className="font-mono text-xs bg-green-50 p-2 rounded-lg border border-green-200 text-gray-700">
                  {sharedSecret ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {sharedSecret.substring(0, 20)}...
                    </span>
                  ) : "-- waiting --"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Encrypted Message (Left) */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            animate={processing ? { x: 80, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-blue-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-blue-200 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Ciphertext</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">Encrypted Message</div>
                <div className="font-mono text-xs bg-blue-50 p-2 rounded-lg border border-blue-200 text-gray-700">
                  {encryptedMessage ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {encryptedMessage.substring(0, 20)}...
                    </span>
                  ) : "-- waiting --"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* IV (Right) */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            animate={processing ? { x: -80, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-amber-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-amber-200 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Nonce</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">Initialization Vector</div>
                <div className="font-mono text-xs bg-amber-50 p-2 rounded-lg border border-amber-200 text-gray-700">
                  {iv ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      {iv}
                    </span>
                  ) : "-- waiting --"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decryption Vessel (Center) */}
          <div className="relative z-20">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-56 h-28 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 shadow-xl flex items-center justify-center overflow-hidden"
                animate={processing ? { 
                  scale: [1, 1.1, 1],
                  borderColor: ["#e5e7eb", "#3b82f6", "#10b981", "#e5e7eb"],
                  boxShadow: [
                    "0 4px 6px -1px rgba(0,0,0,0.1)",
                    "0 10px 15px -3px rgba(59,130,246,0.3)",
                    "0 10px 15px -3px rgba(16,185,129,0.3)",
                    "0 4px 6px -1px rgba(0,0,0,0.1)"
                  ]
                } : {
                  scale: 1,
                  borderColor: "#e5e7eb"
                }}
                transition={{ duration: processing ? 1.6 : 0.6 }}
              >
                {/* Animated background for processing state */}
                {processing && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                
                <div className="relative text-center z-10">
                  <div className="text-sm font-bold text-gray-700 mb-1">
                    {processing ? '🔓 DECRYPTING' : '⚡ AES-GCM'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <span>Decryption Vessel</span>
                    {processing && (
                      <>
                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></span>
                        <span className="text-blue-600">active</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Processing Animation */}
              <AnimatePresence>
                {processing && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-200"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin"></div>
                    </div>
                    <span className="text-sm font-medium text-blue-700">AES-GCM decryption in progress...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {!processing && decryptedMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-green-200 rounded-full">
                          <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-green-700">Message Decrypted Successfully!</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">Original Message</span>
                          <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">recovered</span>
                        </div>
                        <div className="text-lg font-bold text-gray-800 break-words bg-gray-50 p-3 rounded-lg border border-gray-200">
                          "{decryptedMessage}"
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Successfully decrypted with AES-GCM</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Output Display - Redesigned */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">Decrypted Message</span>
          {decryptedMessage && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">recovered</span>
          )}
        </div>
        
        <div className={`relative p-6 rounded-xl border-2 transition-all ${
          decryptedMessage 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md' 
            : 'bg-gray-50 border-gray-200 border-dashed'
        }`}>
          {decryptedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full -ml-1"></div>
                  </div>
                  <span className="text-xs text-gray-500">Plaintext message</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">✓ Verified</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-200 shadow-inner">
                <p className="text-xl font-medium text-gray-800 break-words">"{decryptedMessage}"</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AES-GCM success</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>IV used: {iv?.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Ready for verification</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-400">Click "Decrypt Message" to reveal the original text</span>
              <span className="text-xs text-gray-400">The decrypted message should match your original input</span>
            </div>
          )}
        </div>
      </div>

      {/* Success Metrics */}
      {decryptedMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 grid grid-cols-3 gap-4"
        >
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-xs text-gray-500 mb-1">Decryption Status</div>
            <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Successful
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs text-gray-500 mb-1">Algorithm</div>
            <div className="text-sm font-semibold text-blue-600">AES-256-GCM</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-xs text-gray-500 mb-1">Next Step</div>
            <div className="text-sm font-semibold text-purple-600">Signature Verification</div>
          </div>
        </motion.div>
      )}

      {/* Process Explanation */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-200 rounded-lg">
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">AES-GCM Decryption</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Step 9:</span> The receiver uses the recovered shared secret and the IV 
              to decrypt the ciphertext. AES-GCM provides both confidentiality and authentication, ensuring the message hasn't been 
              tampered with during transmission. The decrypted message should match the sender's original message.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Step 10: Signature Verification */}
<div className="w-full max-w-5xl mt-20">
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    {/* Section Header with decorative elements */}
    <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      <div className="relative">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400"></div>
          <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Phase 7</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Signature Verification</h2>
        <p className="text-gray-500 max-w-2xl">
          Verify the message authenticity using Dilithium post-quantum signature verification
        </p>
      </div>
    </div>

    <div className="p-8">
      {/* Verification Control - Redesigned */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-200 rounded-lg">
              <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Verification Process</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Status Indicators */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${decryptedMessage ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">Message</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${signature ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-600">Signature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Public Key</span>
              </div>
            </div>
            
            <Button 
              onClick={handleVerifySignature} 
              disabled={!decryptedMessage || !signature || verifying}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[220px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {verifying ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying with Dilithium...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Verify Signature</span>
                  </>
                )}
              </span>
            </Button>
          </div>

          {/* Missing Components Warning */}
          {(!decryptedMessage || !signature) && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-amber-700">
                  {!decryptedMessage && 'Complete decryption (Step 9) to get the message. '}
                  {!signature && 'Complete signing (Step 5) to generate signature.'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Animation Section - Redesigned */}
      <div className="relative mb-16">
        <h3 className="text-sm font-medium text-gray-500 mb-6 text-center">Dilithium Verification Process</h3>
        
        <div className="relative h-72 flex items-center justify-center">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/30 to-transparent rounded-3xl"></div>
          
          {/* Connection lines with animated dots */}
          <div className="absolute inset-0">
            {/* Line from top to center */}
            <div className="absolute left-1/2 top-0 bottom-1/2 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200"></div>
            {/* Line from left to center */}
            <div className="absolute right-1/2 left-0 top-1/2 h-0.5 bg-gradient-to-r from-purple-200 to-purple-300"></div>
            {/* Line from right to center */}
            <div className="absolute left-1/2 right-0 top-1/2 h-0.5 bg-gradient-to-l from-green-200 to-green-300"></div>
            
            {/* Animated dots */}
            {verifying && (
              <>
                <motion.div 
                  className="absolute left-1/2 top-0 w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ top: ["0%", "50%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute left-0 top-1/2 w-2 h-2 bg-purple-500 rounded-full"
                  animate={{ left: ["0%", "50%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.3 }}
                />
                <motion.div 
                  className="absolute right-0 top-1/2 w-2 h-2 bg-green-500 rounded-full"
                  animate={{ right: ["0%", "50%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.6 }}
                />
              </>
            )}
          </div>

          {/* Decrypted Message (Top) */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
            animate={verifying ? { y: 40, scale: 1.05 } : { y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-blue-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-blue-200 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Input A</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">Decrypted Message</div>
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 font-medium truncate">"{decryptedMessage || '-- waiting --'}"</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Signature (Left) */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            animate={verifying ? { x: 80, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-purple-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-purple-200 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Input B</span>
                  <div className="ml-auto px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] rounded-full">Dilithium</div>
                </div>
                <div className="text-xs text-gray-500 mb-1">Digital Signature</div>
                <div className="font-mono text-xs bg-purple-50 p-2 rounded-lg border border-purple-200 text-gray-700">
                  {signature ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      {signature.substring(0, 30)}...
                    </span>
                  ) : "-- waiting --"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sender Public Key (Right) */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            animate={verifying ? { x: -80, scale: 1.05 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-green-400 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-xl p-4 shadow-lg border-2 border-green-200 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Input C</span>
                  <div className="ml-auto px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-full">Public</div>
                </div>
                <div className="text-xs text-gray-500 mb-1">Sender Public Key</div>
                <div className="font-mono text-xs bg-green-50 p-2 rounded-lg border border-green-200 text-gray-700">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {sender.dilithiumPublic}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Verification Vessel (Center) */}
          <div className="relative z-20">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-56 h-28 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 shadow-xl flex items-center justify-center overflow-hidden"
                animate={verifying ? { 
                  scale: [1, 1.1, 1],
                  borderColor: ["#e5e7eb", "#8b5cf6", "#10b981", "#e5e7eb"],
                  boxShadow: [
                    "0 4px 6px -1px rgba(0,0,0,0.1)",
                    "0 10px 15px -3px rgba(139,92,246,0.3)",
                    "0 10px 15px -3px rgba(16,185,129,0.3)",
                    "0 4px 6px -1px rgba(0,0,0,0.1)"
                  ]
                } : {
                  scale: 1,
                  borderColor: "#e5e7eb"
                }}
                transition={{ duration: verifying ? 1.6 : 0.6 }}
              >
                {/* Animated background for verifying state */}
                {verifying && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                
                <div className="relative text-center z-10">
                  <div className="text-sm font-bold text-gray-700 mb-1">
                    {verifying ? '🔍 VERIFYING' : '⚡ DILITHIUM'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <span>Verification Vessel</span>
                    {verifying && (
                      <>
                        <span className="w-1 h-1 bg-purple-500 rounded-full animate-ping"></span>
                        <span className="text-purple-600">verifying</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Verification Processing Animation */}
              <AnimatePresence>
                {verifying && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-full border border-purple-200"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full border-2 border-purple-300 border-t-purple-600 animate-spin"></div>
                    </div>
                    <span className="text-sm font-medium text-purple-700">Dilithium verification in progress...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verification Result */}
              <AnimatePresence>
                {!verifying && verificationResult !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full"
                  >
                    <div className={`rounded-xl p-4 shadow-lg ${
                      verificationResult 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300' 
                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${
                          verificationResult ? 'bg-green-200' : 'bg-red-200'
                        }`}>
                          {verificationResult ? (
                            <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-semibold ${
                          verificationResult ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {verificationResult ? 'Signature Verified!' : 'Verification Failed!'}
                        </span>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">Authentication Result</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            verificationResult 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {verificationResult ? 'VALID' : 'INVALID'}
                          </span>
                        </div>
                        
                        <div className={`text-center p-3 rounded-lg ${
                          verificationResult ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <p className={`text-sm font-medium ${
                            verificationResult ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {verificationResult 
                              ? '✓ Message is authentic and untampered' 
                              : '✗ Signature does not match - possible tampering'}
                          </p>
                        </div>

                        {verificationResult && (
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Message origin verified - sent by legitimate sender</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Output Display - Redesigned */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">Verification Result</span>
          {verificationResult !== null && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              verificationResult ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {verificationResult ? 'Authentic' : 'Failed'}
            </span>
          )}
        </div>
        
        <div className={`relative p-6 rounded-xl border-2 transition-all ${
          verificationResult === null 
            ? 'bg-gray-50 border-gray-200 border-dashed' 
            : verificationResult 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md' 
              : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300 shadow-md'
        }`}>
          {verificationResult === null ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-gray-400">Click "Verify Signature" to authenticate the message</span>
              <span className="text-xs text-gray-400">Verification ensures message integrity and sender authenticity</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex ${verificationResult ? 'text-green-500' : 'text-red-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {verificationResult ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {verificationResult ? 'Signature Valid' : 'Signature Invalid'}
                  </span>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Details
                </button>
              </div>
              
              <div className={`p-4 rounded-lg ${
                verificationResult ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <p className={`text-lg font-bold text-center ${
                  verificationResult ? 'text-green-700' : 'text-red-700'
                }`}>
                  {verificationResult 
                    ? '✓ SIGNATURE VALID - Message authenticated' 
                    : '✗ SIGNATURE INVALID - Message tampered'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                  <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Dilithium Level 3</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Post-quantum secure</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Final Success Message - Enhanced */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mt-8 p-8 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl text-center shadow-xl"
        >
          <div className="relative">
            {/* Animated confetti effect (simulated) */}
            <motion.div 
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  initial={{ 
                    top: "50%", 
                    left: "50%",
                    scale: 0 
                  }}
                  animate={{ 
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
              ))}
            </motion.div>

            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                Secure Communication Complete!
              </h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Message successfully encrypted, signed, transmitted, decrypted, and verified
              </p>
              
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <div className="px-3 py-1.5 bg-green-200 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Kyber KEM
                </div>
                <div className="px-3 py-1.5 bg-blue-200 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  AES-GCM
                </div>
                <div className="px-3 py-1.5 bg-purple-200 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Dilithium
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500 bg-white bg-opacity-50 p-3 rounded-lg">
                Post-quantum cryptography protocols executed successfully
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Process Explanation */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-200 rounded-lg">
            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Dilithium Verification Complete</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-purple-600">Step 10:</span> The receiver verifies the signature using the sender's public key. 
              If the signature is valid, it proves the message was signed by the holder of the corresponding private key and hasn't been tampered with. 
              This completes the post-quantum secure communication channel.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      </main>

      <footer className="max-w-5xl mx-auto text-xs text-gray-500 text-center">
        Tip: Complete key exchange first, then enter your message and click "Mix & Encrypt (AES-GCM)".
      </footer>
    </div>
  );
}