import React, { useState } from "react";

import Phase1KeyExchange from "./components/Phase1";
import Phase2MessageEncryption from "./components/Phase2";
import Phase3DigitalSignature from "./components/Phase3";
import Phase4SecureTransmission from "./components/Phase4";
import Phase5KeyDecapsulation from "./components/Phase5";
import Phase6MessageDecryption from "./components/Phase6";
import Phase7SignatureVerification from "./components/Phase7";

export default function Playground() {
  // ── Phase 1: Key Exchange ──────────────────────────────────────────────────
  const [connected, setConnected] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [kyberCiphertext, setKyberCiphertext] = useState(null);
  const [sharedSecret, setSharedSecret] = useState(null);

  // ── Phase 2: Message Encryption ───────────────────────────────────────────
  const [message, setMessage] = useState("Hello");
  const [mixing, setMixing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [encryptedMessage, setEncryptedMessage] = useState(null);
  const [iv, setIv] = useState(null);

  // ── Phase 3: Digital Signature ────────────────────────────────────────────
  const [signing, setSigning] = useState(false);
  const [signatureProcessing, setSignatureProcessing] = useState(false);
  const [signature, setSignature] = useState(null);

  // ── Phase 4: Secure Transmission ──────────────────────────────────────────
  const [transmitting, setTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  // ── Phase 5 & 6: Decapsulation & Decryption ───────────────────────────────
  const [decapsulating, setDecapsulating] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState(null);

  // ── Phase 7: Signature Verification ──────────────────────────────────────
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // ── Static party data ─────────────────────────────────────────────────────
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

  // ── Utility ───────────────────────────────────────────────────────────────
  function mockHex(label, length = 16) {
    const random = () => Math.floor(Math.random() * 16).toString(16).toUpperCase();
    return `${label}-0x` + Array.from({ length }).map(random).join("");
  }

  // ── Phase 1 handler ───────────────────────────────────────────────────────
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

  // ── Phase 2 handler ───────────────────────────────────────────────────────
  async function handleMixAndEncrypt() {
    if (!sharedSecret) {
      alert("First complete key exchange to get shared secret.");
      return;
    }
    setEncryptedMessage(null);
    setIv(null);
    setMixing(true);
    setProcessing(false);

    await new Promise((resolve) => setTimeout(resolve, 900));
    await new Promise((resolve) => setTimeout(resolve, 900));
    setMixing(false);

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIv(mockHex("iv", 8));
    setEncryptedMessage(mockHex("enc-msg", 20));
    setProcessing(false);
  }

  // ── Phase 3 handler ───────────────────────────────────────────────────────
  async function handleSignMessage() {
    if (!message) {
      alert("Please enter a message to sign.");
      return;
    }
    setSignature(null);
    setSigning(true);
    setSignatureProcessing(false);

    await new Promise((resolve) => setTimeout(resolve, 900));
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSigning(false);

    setSignatureProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSignature(mockHex("dilithium-signature", 32));
    setSignatureProcessing(false);
  }

  // ── Phase 4 handler ───────────────────────────────────────────────────────
  async function handleTransmit() {
    if (!kyberCiphertext || !encryptedMessage || !iv || !signature) {
      alert("Please complete all previous steps first.");
      return;
    }
    setTransmitting(true);
    setTransmitted(false);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setTransmitting(false);
    setTransmitted(true);
  }

  // ── Phase 5 handler ───────────────────────────────────────────────────────
  async function handleDecapsulate() {
    if (!kyberCiphertext) {
      alert("No ciphertext received for decapsulation.");
      return;
    }
    setDecapsulating(true);
    setSharedSecret(null);

    await new Promise((resolve) => setTimeout(resolve, 900));
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSharedSecret(mockHex("shared-secret-recovered", 16));
    setDecapsulating(false);
  }

  // ── Phase 6 handler ───────────────────────────────────────────────────────
  async function handleDecryptMessage() {
    if (!sharedSecret || !encryptedMessage || !iv) {
      alert("Need shared secret, encrypted message, and IV for decryption.");
      return;
    }
    setDecryptedMessage(null);
    setProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 900));
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setDecryptedMessage(message);
    setProcessing(false);
  }

  // ── Phase 7 handler ───────────────────────────────────────────────────────
  async function handleVerifySignature() {
    if (!decryptedMessage || !signature) {
      alert("Need decrypted message and signature for verification.");
      return;
    }
    setVerifying(true);
    setVerificationResult(null);

    await new Promise((resolve) => setTimeout(resolve, 900));
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setVerificationResult(true);
    setVerifying(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 p-8 flex flex-col gap-8">
      <header className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Post-Quantum Chat — Visual Playground
        </h1>
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen">

        <Phase1KeyExchange
          connected={connected}
          animating={animating}
          kyberCiphertext={kyberCiphertext}
          sharedSecret={sharedSecret}
          handleConnect={handleConnect}
          sender={sender}
          receiver={receiver}
        />

        <Phase2MessageEncryption
          message={message}
          setMessage={setMessage}
          sharedSecret={sharedSecret}
          mixing={mixing}
          processing={processing}
          encryptedMessage={encryptedMessage}
          iv={iv}
          handleMixAndEncrypt={handleMixAndEncrypt}
        />

        <Phase3DigitalSignature
          message={message}
          signing={signing}
          signatureProcessing={signatureProcessing}
          signature={signature}
          handleSignMessage={handleSignMessage}
          encryptedMessage={encryptedMessage}
          iv={iv}
          kyberCiphertext={kyberCiphertext}
          sender={sender}
        />

        <Phase4SecureTransmission
          kyberCiphertext={kyberCiphertext}
          encryptedMessage={encryptedMessage}
          iv={iv}
          signature={signature}
          transmitting={transmitting}
          transmitted={transmitted}
          handleTransmit={handleTransmit}
        />

        <Phase5KeyDecapsulation
          kyberCiphertext={kyberCiphertext}
          sharedSecret={sharedSecret}
          decapsulating={decapsulating}
          handleDecapsulate={handleDecapsulate}
          receiver={receiver}
        />

        <Phase6MessageDecryption
          sharedSecret={sharedSecret}
          encryptedMessage={encryptedMessage}
          iv={iv}
          processing={processing}
          decryptedMessage={decryptedMessage}
          handleDecryptMessage={handleDecryptMessage}
        />

        <Phase7SignatureVerification
          decryptedMessage={decryptedMessage}
          signature={signature}
          verifying={verifying}
          verificationResult={verificationResult}
          handleVerifySignature={handleVerifySignature}
          sender={sender}
        />

      </main>

      <footer className="max-w-5xl mx-auto text-xs text-gray-500 text-center">
        Tip: Complete key exchange first, then enter your message and click "Mix & Encrypt (AES-GCM)".
      </footer>
    </div>
  );
}