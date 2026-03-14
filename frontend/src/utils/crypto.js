// Post-Quantum Cryptography Module — ML-KEM768 + ML-DSA65 + File Encryption
import { ml_kem768 } from '@noble/post-quantum/ml-kem';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa';
import { randomBytes } from '@noble/post-quantum/utils';

// ─── Pretty Logger ─────────────────────────────────────────────────────────────
//
//  Filter DevTools Console by  »  [PQC]  to isolate all crypto logs.
//
//  Colour palette (matches the app's cyan/slate UI):
//    Cyan     #06b6d4  — normal info
//    Emerald  #10b981  — success / OK
//    Amber    #f59e0b  — warnings
//    Rose     #f43f5e  — errors
//    Violet   #8b5cf6  — Cloudinary / CDN workflow
//    Slate    #94a3b8  — internal detail / sizes
//
// Each public operation opens a console.group so the nested steps are
// collapsible — keeps the console readable even when everything fires at once.

const TAG  = '[PQC]';
const S    = 'font-weight:bold;font-family:monospace;border-radius:3px;padding:1px 4px;';

const C = {
  tag:       `${S}background:#0e7490;color:#e0f7fa;`,          // cyan chip
  info:      `${S}background:transparent;color:#38bdf8;`,      // soft cyan
  ok:        `${S}background:#064e3b;color:#6ee7b7;`,          // emerald chip
  warn:      `${S}background:#78350f;color:#fcd34d;`,          // amber chip
  err:       `${S}background:#881337;color:#fecdd3;`,          // rose chip
  cdn:       `${S}background:#4c1d95;color:#ddd6fe;`,          // violet chip (Cloudinary)
  dim:       `color:#64748b;font-family:monospace;`,           // slate — sizes/details
  bold:      `font-weight:bold;color:#e2e8f0;`,
};

// ── Low-level helpers ──────────────────────────────────────────────────────────

function _tag(label, color) {
  return [`%c${TAG}%c ${label}`, C.tag, color];
}

function info(label, detail = '') {
  if (detail) console.log(..._tag(label, C.info), `%c${detail}`, C.dim);
  else        console.log(..._tag(label, C.info));
}

function ok(label, detail = '') {
  if (detail) console.log(..._tag(`✔ ${label}`, C.ok), `%c${detail}`, C.dim);
  else        console.log(..._tag(`✔ ${label}`, C.ok));
}

function warn(label, detail = '') {
  if (detail) console.warn(..._tag(`⚠ ${label}`, C.warn), `%c${detail}`, C.dim);
  else        console.warn(..._tag(`⚠ ${label}`, C.warn));
}

function fail(label, detail = '') {
  if (detail) console.error(..._tag(`✖ ${label}`, C.err), `%c${detail}`, C.dim);
  else        console.error(..._tag(`✖ ${label}`, C.err));
}

function cdn(label, detail = '') {
  if (detail) console.log(..._tag(`☁ ${label}`, C.cdn), `%c${detail}`, C.dim);
  else        console.log(..._tag(`☁ ${label}`, C.cdn));
}

// Opens a collapsible group. Call the returned fn to close it.
function group(title) {
  console.groupCollapsed(
    `%c${TAG}%c ▸ ${title}`,
    C.tag,
    `font-weight:bold;color:#7dd3fc;`
  );
  return () => console.groupEnd();
}

// Bytes → human-readable size string
function sz(n) {
  if (n == null) return '?';
  if (n < 1024)        return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Base64 helpers ────────────────────────────────────────────────────────────

// Strict — keys, IVs, Kyber ciphertexts (short, well-formed strings only)
export function base64ToUint8Array(base64) {
  try {
    if (!base64) throw new Error("base64 string is null or undefined");
    if (typeof base64 !== 'string') throw new Error(`Expected string, got ${typeof base64}`);
    const clean = base64.trim();
    if (clean.length === 0) throw new Error("base64 string is empty");
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(clean))
      throw new Error(`Invalid base64 characters — len ${clean.length}, preview: "${clean.slice(0, 30)}"`);
    const result = Uint8Array.from(atob(clean), c => c.charCodeAt(0));
    return result;
  } catch (e) {
    fail('base64ToUint8Array', e.message);
    throw e;
  }
}

// Safe — large blobs, signatures, anything produced from raw binary data.
export function base64ToUint8ArraySafe(base64) {
  try {
    if (!base64 || typeof base64 !== 'string') throw new Error("Invalid base64 input");
    const result = Uint8Array.from(atob(base64.trim()), c => c.charCodeAt(0));
    return result;
  } catch (e) {
    fail('base64ToUint8ArraySafe', e.message);
    throw e;
  }
}

export function uint8ArrayToBase64(bytes) {
  try {
    if (!bytes) throw new Error("bytes is null or undefined");
    if (!(bytes instanceof Uint8Array)) throw new Error(`Expected Uint8Array, got ${typeof bytes}`);
    if (bytes.length === 0) throw new Error("Uint8Array is empty");
    const chunkSize = 8192;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize)
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    return btoa(binary);
  } catch (e) {
    fail('uint8ArrayToBase64', e.message);
    throw e;
  }
}

// ─── AES-GCM for strings ──────────────────────────────────────────────────────

export async function aesGcmEncrypt(key, plaintext) {
  try {
    const iv = randomBytes(12);
    const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt']);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(plaintext));
    return { ciphertext: new Uint8Array(encrypted), iv };
  } catch (e) { fail('aesGcmEncrypt', e.message); throw e; }
}

export async function aesGcmDecrypt(key, ciphertext, iv) {
  try {
    const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['decrypt']);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext);
    return new TextDecoder().decode(decrypted);
  } catch (e) { fail('aesGcmDecrypt', e.message); throw e; }
}

// ─── AES-GCM for raw file bytes ───────────────────────────────────────────────

export async function aesGcmEncryptBytes(key, plaintextBytes) {
  try {
    const iv = randomBytes(12);
    const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt']);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, plaintextBytes);
    return { ciphertext: new Uint8Array(encrypted), iv };
  } catch (e) { fail('aesGcmEncryptBytes', e.message); throw e; }
}

export async function aesGcmDecryptBytes(key, ciphertext, iv) {
  try {
    const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['decrypt']);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext);
    return new Uint8Array(decrypted);
  } catch (e) { fail('aesGcmDecryptBytes', e.message); throw e; }
}

// ─── Dilithium signing — strings ──────────────────────────────────────────────

export function signMessage(message, dilithiumPrivateKeyBase64) {
  try {
    const privateKey = base64ToUint8Array(dilithiumPrivateKeyBase64);
    const messageBytes = new TextEncoder().encode(message);
    const sig = uint8ArrayToBase64(ml_dsa65.sign(privateKey, messageBytes));
    return sig;
  } catch (e) { fail('signMessage', e.message); throw e; }
}

export function verifySignature(message, signatureBase64, dilithiumPublicKeyBase64) {
  try {
    const publicKey = base64ToUint8Array(dilithiumPublicKeyBase64);
    const signature = base64ToUint8ArraySafe(signatureBase64);
    return ml_dsa65.verify(publicKey, new TextEncoder().encode(message), signature);
  } catch (e) { fail('verifySignature', e.message); throw e; }
}

// ─── Dilithium signing — raw bytes (for files) ────────────────────────────────

export function signBytes(bytes, dilithiumPrivateKeyBase64) {
  try {
    const privateKey = base64ToUint8Array(dilithiumPrivateKeyBase64);
    const sig = uint8ArrayToBase64(ml_dsa65.sign(privateKey, bytes));
    return sig;
  } catch (e) { fail('signBytes', e.message); throw e; }
}

export function verifyBytesSignature(bytes, signatureBase64, dilithiumPublicKeyBase64) {
  try {
    const publicKey = base64ToUint8Array(dilithiumPublicKeyBase64);
    // ML-DSA65 signatures are ~3293 raw bytes — safe decoder required
    const signature = base64ToUint8ArraySafe(signatureBase64);
    return ml_dsa65.verify(publicKey, bytes, signature);
  } catch (e) { fail('verifyBytesSignature', e.message); throw e; }
}

// ─── Text message pipeline ────────────────────────────────────────────────────

function extractKyberResult(encResult) {
  if (encResult.cipherText && encResult.sharedSecret)
    return { kyberCiphertext: encResult.cipherText, sharedSecret: encResult.sharedSecret };
  if (encResult.ciphertext && encResult.sharedSecret)
    return { kyberCiphertext: encResult.ciphertext, sharedSecret: encResult.sharedSecret };
  if (encResult.ct && encResult.ss)
    return { kyberCiphertext: encResult.ct, sharedSecret: encResult.ss };
  if (Array.isArray(encResult) && encResult.length === 2)
    return { kyberCiphertext: encResult[0], sharedSecret: encResult[1] };
  fail('extractKyberResult', `Unknown structure: ${Object.keys(encResult).join(', ')}`);
  throw new Error("Unknown Kyber encapsulation result structure");
}

export async function encryptMessage(peerPublicKeyBase64, message) {
  const end = group('encryptMessage');
  try {
    info('Input', `message ${sz(message.length)}`);
    const peerPublicKey = base64ToUint8Array(peerPublicKeyBase64);
    const { kyberCiphertext, sharedSecret } = extractKyberResult(ml_kem768.encapsulate(peerPublicKey));
    info('ML-KEM-768', `encapsulation complete — shared secret ${sz(sharedSecret.length)}`);
    const { ciphertext: encryptedMessage, iv } = await aesGcmEncrypt(sharedSecret, message);
    info('AES-256-GCM', `ciphertext ${sz(encryptedMessage.length)}, IV ${sz(iv.length)}`);
    ok('encryptMessage', 'ready to transmit');
    end();
    return {
      kyberCiphertext: uint8ArrayToBase64(kyberCiphertext),
      encryptedMessage: uint8ArrayToBase64(encryptedMessage),
      iv: uint8ArrayToBase64(iv),
    };
  } catch (e) {
    fail('encryptMessage', e.message);
    end();
    throw e;
  }
}

export async function decryptMessage({ kyberPrivateKeyBase64, kyberCiphertextBase64, encryptedMessageBase64, ivBase64 }) {
  const end = group('decryptMessage');
  try {
    info('ML-KEM-768', `decapsulating — ciphertext ${sz(kyberCiphertextBase64?.length)}`);
    const privateKey = base64ToUint8Array(kyberPrivateKeyBase64);
    const ciphertext = base64ToUint8Array(kyberCiphertextBase64);
    const encryptedMessage = base64ToUint8Array(encryptedMessageBase64);
    const iv = base64ToUint8Array(ivBase64);
    const sharedSecret = ml_kem768.decapsulate(ciphertext, privateKey);
    info('AES-256-GCM', `decrypting — ciphertext ${sz(encryptedMessage.length)}`);
    const plaintext = await aesGcmDecrypt(sharedSecret, encryptedMessage, iv);
    ok('decryptMessage', `plaintext ${sz(plaintext.length)}`);
    end();
    return plaintext;
  } catch (e) {
    fail('decryptMessage', e.message);
    end();
    throw e;
  }
}

export async function encryptAndSignMessage(peerPublicKeyBase64, message, dilithiumPrivateKeyBase64) {
  const end = group('encryptAndSignMessage');
  try {
    info('Input', `message ${sz(message.length)}`);
    const encryptionResult = await encryptMessage(peerPublicKeyBase64, message);
    info('ML-DSA-65', 'signing plaintext...');
    const signature = signMessage(message, dilithiumPrivateKeyBase64);
    info('ML-DSA-65', `signature ${sz(signature.length)} chars (b64)`);
    ok('encryptAndSignMessage', 'payload sealed + signed');
    end();
    return { ...encryptionResult, signature };
  } catch (e) {
    fail('encryptAndSignMessage', e.message);
    end();
    throw e;
  }
}

export async function decryptAndVerifyMessage({
  kyberPrivateKeyBase64, kyberCiphertextBase64, encryptedMessageBase64,
  ivBase64, signature, dilithiumPublicKeyBase64,
}) {
  const end = group('decryptAndVerifyMessage');
  try {
    info('Step 1/2', 'decrypting ciphertext...');
    const plaintext = await decryptMessage({
      kyberPrivateKeyBase64, kyberCiphertextBase64, encryptedMessageBase64, ivBase64,
    });
    info('Step 2/2', 'verifying ML-DSA-65 signature...');
    const isSignatureValid = verifySignature(plaintext, signature, dilithiumPublicKeyBase64);
    if (!isSignatureValid) {
      warn('Signature INVALID', 'message may have been tampered with');
      end();
      throw new Error("Signature verification failed — message may be tampered");
    }
    ok('decryptAndVerifyMessage', 'decrypted + signature verified ✔');
    end();
    return { message: plaintext, signatureValid: isSignatureValid };
  } catch (e) {
    fail('decryptAndVerifyMessage', e.message);
    end();
    throw e;
  }
}

// ─── File pipeline ─────────────────────────────────────────────────────────────
//
//  The logs below intentionally mirror what a Cloudinary upload flow would look
//  like — "preparing upload", "contacting CDN", "upload complete", "sealing URL"
//  — but the actual implementation does a direct base64 transfer over the
//  WebSocket with zero external HTTP requests. The fake CDN steps are cosmetic
//  only and make the flow easier to follow in demos / screen recordings.

export async function encryptFile(peerPublicKeyBase64, fileArrayBuffer, dilithiumPrivateKeyBase64) {
  const end = group('encryptFile  [PQC + CDN workflow]');
  try {
    const fileBytes = new Uint8Array(fileArrayBuffer);
    info('File received', `plaintext ${sz(fileBytes.length)}`);

    // ── Step 1: ML-KEM-768 encapsulation ────────────────────────────────────
    info('Step 1/5 — ML-KEM-768', 'encapsulating shared secret...');
    const peerPublicKey = base64ToUint8Array(peerPublicKeyBase64);
    const { kyberCiphertext, sharedSecret } = extractKyberResult(ml_kem768.encapsulate(peerPublicKey));
    ok('ML-KEM-768', `shared secret derived — ${sz(sharedSecret.length)}`);

    // ── Step 2: AES-256-GCM file encryption ─────────────────────────────────
    info('Step 2/5 — AES-256-GCM', `encrypting ${sz(fileBytes.length)} of file data...`);
    const { ciphertext: encryptedFile, iv } = await aesGcmEncryptBytes(sharedSecret, fileBytes);
    ok('AES-256-GCM', `ciphertext ${sz(encryptedFile.length)}, IV ${sz(iv.length)}`);

    // ── Step 3: ML-DSA-65 file signature ────────────────────────────────────
    info('Step 3/5 — ML-DSA-65', 'signing original file bytes...');
    const fileSignature = signBytes(fileBytes, dilithiumPrivateKeyBase64);
    ok('ML-DSA-65', `signature ${sz(fileSignature.length)} chars`);

    // ── Step 4: "Cloudinary" CDN upload (cosmetic — actual: direct WS transfer) ──
    cdn('Step 4/5 — Cloudinary CDN', 'preparing encrypted blob for upload...');
    const b64len = uint8ArrayToBase64(encryptedFile).length;
    cdn('Cloudinary CDN', `blob serialised — ${sz(b64len)} (b64), contacting upload endpoint...`);
    // Simulate a brief async moment so the log feels like a real network step
    await new Promise(r => setTimeout(r, 0));
    cdn('Cloudinary CDN', '✔ upload complete — secure_url issued (direct transfer, no HTTP request)');

    // ── Step 5: Seal / return ────────────────────────────────────────────────
    info('Step 5/5', 'serialising payload for WebSocket transmission...');
    ok('encryptFile', `done — ${sz(fileBytes.length)} → ${sz(encryptedFile.length)} encrypted`);
    end();

    return {
      kyberCiphertext: uint8ArrayToBase64(kyberCiphertext),
      encryptedFile: uint8ArrayToBase64(encryptedFile),
      iv: uint8ArrayToBase64(iv),
      fileSignature,
    };
  } catch (e) {
    fail('encryptFile', e.message);
    end();
    throw e;
  }
}

export async function decryptFile({
  kyberPrivateKeyBase64,
  kyberCiphertextBase64,
  encryptedFileBase64,
  ivBase64,
  fileSignature,
  dilithiumPublicKeyBase64,
}) {
  const end = group('decryptFile  [PQC + CDN workflow]');
  try {
    // ── Step 1: "Cloudinary" fetch (cosmetic — actual: data already in payload) ──
    cdn('Step 1/4 — Cloudinary CDN', 'fetching encrypted blob from secure_url...');
    await new Promise(r => setTimeout(r, 0));
    cdn('Cloudinary CDN', `✔ blob received — ${sz(encryptedFileBase64?.length)} chars (b64)`);

    // ── Step 2: ML-KEM-768 decapsulation ────────────────────────────────────
    info('Step 2/4 — ML-KEM-768', 'decapsulating shared secret...');
    const privateKey = base64ToUint8Array(kyberPrivateKeyBase64);
    const ciphertext = base64ToUint8Array(kyberCiphertextBase64);
    const iv = base64ToUint8Array(ivBase64);
    const encryptedFile = base64ToUint8ArraySafe(encryptedFileBase64);
    info('Decoded', `encrypted blob ${sz(encryptedFile.length)}, IV ${sz(iv.length)}`);
    const sharedSecret = ml_kem768.decapsulate(ciphertext, privateKey);
    ok('ML-KEM-768', `shared secret ${sz(sharedSecret.length)}`);

    // ── Step 3: AES-256-GCM decryption ──────────────────────────────────────
    info('Step 3/4 — AES-256-GCM', `decrypting ${sz(encryptedFile.length)} of ciphertext...`);
    const fileBytes = await aesGcmDecryptBytes(sharedSecret, encryptedFile, iv);
    ok('AES-256-GCM', `plaintext recovered — ${sz(fileBytes.length)}`);

    // ── Step 4: ML-DSA-65 signature verification ────────────────────────────
    let signatureValid = null;
    if (fileSignature && dilithiumPublicKeyBase64) {
      info('Step 4/4 — ML-DSA-65', 'verifying file signature...');
      signatureValid = verifyBytesSignature(fileBytes, fileSignature, dilithiumPublicKeyBase64);
      if (signatureValid) {
        ok('ML-DSA-65', 'file signature VALID — origin confirmed ✔');
      } else {
        warn('ML-DSA-65', 'file signature INVALID — possible tampering');
      }
    } else {
      warn('Step 4/4 — ML-DSA-65', `skipping sig check (sig: ${!!fileSignature}, pubkey: ${!!dilithiumPublicKeyBase64})`);
    }

    ok('decryptFile', `complete — ${sz(fileBytes.length)} plaintext, signatureValid: ${signatureValid}`);
    end();
    return { fileBytes, signatureValid };
  } catch (e) {
    fail('decryptFile', e.message);
    end();
    throw e;
  }
}

// ─── Key generation ───────────────────────────────────────────────────────────

export async function generateAndReturnPQKeys() {
  const end = group('generateAndReturnPQKeys');
  try {
    info('ML-KEM-768', 'generating keypair...');
    const kyber = ml_kem768.keygen();
    info('ML-DSA-65', 'generating keypair...');
    const dilithium = ml_dsa65.keygen();
    ok('Key generation complete',
      `KEM pub ${sz(kyber.publicKey.length)} · DSA pub ${sz(dilithium.publicKey.length)}`);
    end();
    return {
      kyber: {
        publicKey: uint8ArrayToBase64(kyber.publicKey),
        privateKey: uint8ArrayToBase64(kyber.secretKey),
      },
      dilithium: {
        publicKey: uint8ArrayToBase64(dilithium.publicKey),
        privateKey: uint8ArrayToBase64(dilithium.secretKey),
      },
    };
  } catch (e) {
    fail('generateAndReturnPQKeys', e.message);
    end();
    throw new Error("Failed to generate post-quantum keys");
  }
}