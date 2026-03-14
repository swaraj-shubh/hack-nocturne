# 🔐 HackNocturne — Post-Quantum Encrypted Chat

> **Stealth-mode quantum encryption for high-risk intelligence nodes.**
> A full-stack, end-to-end encrypted chat application leveraging Post-Quantum Cryptography (PQC) standards — ML-KEM-768 (Kyber) for key encapsulation and ML-DSA-65 (Dilithium) for digital signatures.

---

## 📸 Demo

| | |
|---|---|
| ![Demo 1](pic1) | ![Demo 2](pic2) |
| *Home / Landing Page* | *Secure Chat Interface* |

| | |
|---|---|
| ![Demo 3](pic3) | ![Demo 4](pic4) |
| *PQC Playground — Key Exchange Phase* | *Registration Flow (WebAuthn + PQC Keys)* |

| | |
|---|---|
| ![Demo 5](pic5) | ![Demo 6](pic6) |
| *Chat Sidebar — Secure Nodes* | *File Transfer — Encrypted* |

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Cryptography Architecture](#-cryptography-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [API Reference](#-api-reference)
  - [Authentication](#authentication-routes)
  - [User](#user-routes)
  - [Chat & Messages](#chat--message-routes)
  - [Cloudinary](#cloudinary-routes)
  - [WebSocket](#websocket-endpoints)
- [PQC Playground](#-pqc-playground)
- [Security Model](#-security-model)
- [Known Limitations](#-known-limitations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧭 Overview

HackNocturne is a **passwordless, post-quantum secure** real-time chat platform. It combines:

- **WebAuthn / FIDO2** for passwordless authentication (biometrics, hardware keys)
- **ML-KEM-768** (CRYSTALS-Kyber) for quantum-resistant key encapsulation
- **ML-DSA-65** (CRYSTALS-Dilithium) for quantum-resistant digital signatures
- **AES-256-GCM** for symmetric message encryption
- **WebSockets** for real-time message delivery
- **MongoDB** for persistent storage of encrypted messages

The backend never sees plaintext — all encryption and decryption happens **client-side** in the browser.

---

## ✨ Features

- 🔑 **Passwordless Login** via WebAuthn (Face ID, Touch ID, hardware keys)
- 🛡️ **Post-Quantum Key Exchange** — ML-KEM-768 per message
- ✍️ **Digital Signatures** — every message is signed with ML-DSA-65
- 💬 **Real-time Chat** over secure WebSocket connections
- 📁 **Encrypted File Transfer** — files encrypted before transmission, no CDN
- 🔗 **Invite Code System** — connect with peers using unique invite codes
- 🧪 **Interactive PQC Playground** — visual, step-by-step walkthrough of the full cryptography pipeline
- 🗝️ **Private Key Storage** — keys stored locally in IndexedDB / localStorage, never sent to server
- 📜 **Message History** — encrypted messages persisted server-side; decrypted client-side on load
- 🎨 **Industrial Cyberpunk UI** — dark theme with amber/orange accent design system

---

## 🔬 Cryptography Architecture

The full communication pipeline executes these phases:

```
Phase 1 — Key Exchange
  Sender fetches Receiver's ML-KEM-768 public key
  Sender runs  ml_kem768.encapsulate(receiverPublicKey)
             → KyberCiphertext  +  SharedSecret

Phase 2 — Message Encryption
  AES-256-GCM encrypt(SharedSecret, PlaintextMessage)
             → EncryptedMessage  +  IV

Phase 3 — Digital Signature
  ML-DSA-65.sign(SenderDilithiumPrivateKey, PlaintextMessage)
             → Signature

Phase 4 — Transmission (WebSocket)
  Payload sent: { KyberCiphertext, EncryptedMessage, IV, Signature }

Phase 5 — Key Decapsulation  (Receiver side)
  ml_kem768.decapsulate(KyberCiphertext, ReceiverPrivateKey)
             → SharedSecret (identical to sender's)

Phase 6 — Decryption
  AES-256-GCM decrypt(SharedSecret, EncryptedMessage, IV)
             → PlaintextMessage

Phase 7 — Signature Verification
  ML-DSA-65.verify(SenderDilithiumPublicKey, PlaintextMessage, Signature)
             → valid | TAMPERED
```

> **File transfers** follow the same pipeline but operate on raw bytes instead of strings, using `aesGcmEncryptBytes` / `aesGcmDecryptBytes`.

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | FastAPI (Python) |
| Database | MongoDB (PyMongo) |
| WebSockets | FastAPI WebSocket |
| Auth | WebAuthn (`py_webauthn`) |
| JWT | `python-jose` |
| Config | Pydantic Settings |
| File Storage | Cloudinary (signature generation only) |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| PQC Library | `@noble/post-quantum` |
| WebAuthn | `@simplewebauthn/browser` |
| State Management | Zustand |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Local Storage | IndexedDB (via custom `chatStorage` class) |
| Routing | React Router v7 |

---

## 🗂 Project Structure

```
hacknocturn/
├── backend/
│   ├── middleware.py              # CORS configuration
│   └── src/
│       ├── __init__.py            # FastAPI app entrypoint, router registration
│       ├── config.py              # Pydantic settings (env vars)
│       ├── db/
│       │   └── main.py            # MongoDB connection + collection handles
│       ├── models/
│       │   └── auth.py            # Pydantic request/response models
│       ├── routes/
│       │   ├── auth.py            # WebAuthn + registration/login endpoints
│       │   ├── chat.py            # WebSocket chat + message history
│       │   ├── user.py            # User profile, connections, public keys
│       │   └── cloudinary.py      # Signed Cloudinary upload URL
│       ├── utils/
│       │   ├── auth.py            # JWT creation/decode, user dependency
│       │   ├── webauthn.py        # Registration begin/complete helpers
│       │   ├── login.py           # Login begin/complete helpers
│       │   ├── email.py           # Brevo SMTP email (background tasks)
│       │   └── cloudinary_config.py
│       └── ws/
│           └── connection_manager.py  # WebSocket connection + pairing + DB save
│
└── frontend/
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx                # Route definitions
    │   ├── main.jsx               # React entry point
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Register.jsx
    │   │   ├── Login.jsx
    │   │   └── Chat.jsx
    │   ├── components/
    │   │   ├── navbar.jsx
    │   │   ├── ChatSidebar.jsx
    │   │   ├── WebSocketChatBox.jsx
    │   │   ├── EnterInviteCode.jsx
    │   │   ├── PlayGround.jsx
    │   │   └── components/        # Playground phase sub-components
    │   │       ├── Phase1.jsx     # Key Exchange visualization
    │   │       ├── Phase2.jsx     # Message Encryption visualization
    │   │       ├── Phase3.jsx     # Digital Signature visualization
    │   │       ├── Phase4.jsx     # Secure Transmission visualization
    │   │       ├── Phase5.jsx     # Key Decapsulation visualization
    │   │       ├── Phase6.jsx     # Message Decryption visualization
    │   │       └── Phase7.jsx     # Signature Verification visualization
    │   ├── context/
    │   │   ├── useAuthStore.js    # Zustand auth store
    │   │   └── useChatStore.js    # Zustand chat/peer store
    │   ├── utils/
    │   │   ├── crypto.js          # Full PQC crypto pipeline
    │   │   ├── chatStorage.js     # IndexedDB abstraction
    │   │   └── base64.js          # Base64URL helpers (WebAuthn)
    │   └── components/ui/         # shadcn/ui components
```

---

## ✅ Prerequisites

- **Python** 3.11+
- **Node.js** 20+
- **MongoDB** (local or Atlas)
- **mkcert** (for local HTTPS — WebAuthn requires HTTPS)

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hacknocturn.git
cd hacknocturn
```

---

### Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pymongo pydantic-settings python-jose[cryptography] \
            py-webauthn fastapi-mail cloudinary python-multipart
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# WebAuthn (set to your actual domain in production)
RP_ID=localhost
RP_NAME=CodeOfHonour
FRONTEND_ORIGIN=https://localhost:5173
```

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

#### Generate local HTTPS certificates (required for WebAuthn)

```bash
# Install mkcert if you haven't already
# macOS: brew install mkcert
# Windows: choco install mkcert

mkcert -install
mkcert localhost

# This creates localhost.pem and localhost-key.pem
# Move them to the frontend/ directory
mv localhost.pem frontend/
mv localhost-key.pem frontend/
```

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://...` |
| `SECRET_KEY` | JWT signing secret | `my_secret_key` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes | `10080` (7 days) |
| `RP_ID` | WebAuthn Relying Party ID | `localhost` |
| `RP_NAME` | WebAuthn app display name | `CodeOfHonour` |
| `FRONTEND_ORIGIN` | Allowed WebAuthn origin | `https://localhost:5173` |

---

## 🚀 Running the App

### Start the Backend

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Run with uvicorn (from the backend/ directory)
uvicorn src:app --host 0.0.0.0 --port 8000 --ssl-keyfile ./localhost-key.pem --ssl-certfile ./localhost.pem --reload
```

> The backend runs at: **`https://localhost:8000`**

---

### Start the Frontend

```bash
cd frontend

npm run dev
```

> The frontend runs at: **`https://localhost:5173`**

---

### Open the App

Navigate to **`https://localhost:5173`** in your browser.

> ⚠️ You may see a browser security warning for self-signed certificates — click "Advanced" → "Proceed" on both `localhost:8000` and `localhost:5173`.

---

## 📡 API Reference

Base URL: `https://localhost:8000`

All authenticated routes require a valid `access_token` cookie set after login.

---

### Authentication Routes

**Prefix:** `/api/v1/auth`

#### `POST /api/v1/auth/register-begin`

Initiates WebAuthn registration. Returns a challenge and registration options.

**Request Body:**
```json
{
  "username": "operator_01",
  "email": "operator@network.xyz"
}
```

**Response:**
```json
{
  "challenge": "base64url_challenge",
  "rp": { "id": "localhost", "name": "CodeOfHonour" },
  "user": { "id": "...", "name": "operator_01", "displayName": "operator_01" },
  "pubKeyCredParams": [...],
  "authenticatorSelection": { ... }
}
```

---

#### `POST /api/v1/auth/register-complete`

Completes WebAuthn registration. Verifies the authenticator response and stores the credential.

**Request Body:**
```json
{
  "username": "operator_01",
  "registration_response": {
    "id": "...",
    "rawId": "...",
    "type": "public-key",
    "response": {
      "attestationObject": "...",
      "clientDataJSON": "..."
    }
  }
}
```

**Response:**
```json
{ "verified": true }
```

---

#### `POST /api/v1/auth/register`

Stores the user's post-quantum public keys (Kyber + Dilithium) after WebAuthn registration is complete.

**Request Body:**
```json
{
  "username": "operator_01",
  "email": "operator@network.xyz",
  "kyberPublicKey": "<base64_encoded_ML-KEM-768_public_key>",
  "dilithiumPublicKey": "<base64_encoded_ML-DSA-65_public_key>"
}
```

**Response:**
```json
{
  "msg": "User registered successfully",
  "invite_code": "a1b2c3d4"
}
```

---

#### `POST /api/v1/auth/login-begin`

Initiates WebAuthn login. Returns a challenge for the user's registered authenticator.

**Request Body:**
```json
{ "username": "operator_01" }
```

**Response:**
```json
{
  "challenge": "base64url_challenge",
  "allowCredentials": [...],
  "userVerification": "required"
}
```

---

#### `POST /api/v1/auth/login-complete`

Completes WebAuthn login. Verifies the signed challenge and sets a session cookie.

**Request Body:**
```json
{
  "username": "operator_01",
  "authentication_response": {
    "id": "...",
    "rawId": "...",
    "type": "public-key",
    "response": {
      "authenticatorData": "...",
      "clientDataJSON": "...",
      "signature": "...",
      "userHandle": null
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "msg": "Login successful",
  "user": { "_id": "...", "username": "operator_01", "invite_code": "..." }
}
```

Sets `access_token` cookie: `HttpOnly`, `Secure`, `SameSite=None`, 7-day expiry.

---

#### `POST /api/v1/auth/logout`

Clears the session cookie.

**Response:**
```json
{ "message": "Logged out successfully" }
```

---

### User Routes

**Prefix:** `/api/v1/user`

All routes require authentication cookie.

---

#### `GET /api/v1/user/me`

Returns the authenticated user's profile.

**Response:**
```json
{
  "_id": "6789...",
  "username": "operator_01",
  "email": "operator@network.xyz",
  "invite_code": "a1b2c3d4",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "kyber_public_key": "<base64>",
  "dilithium_public_key": "<base64>"
}
```

---

#### `POST /api/v1/user/connect`

Connects with another user using their invite code. Mutual connection is created.

**Request Body:**
```json
{ "invite_code": "a1b2c3d4" }
```

**Response:**
```json
{
  "msg": "Connected successfully",
  "connected_user": { "_id": "...", "username": "other_user" }
}
```

---

#### `GET /api/v1/user/connections`

Returns a list of all connected users.

**Response:**
```json
[
  { "username": "peer_01", "user_id": "..." },
  { "username": "peer_02", "user_id": "..." }
]
```

---

#### `GET /api/v1/user/keys/{user_id}`

Fetches a user's ML-KEM-768 and ML-DSA-65 public keys. Used by the frontend before encrypting a message.

**Path Parameter:** `user_id` — MongoDB ObjectId of the target user

**Response:**
```json
{
  "kyber_public_key": "<base64_encoded_public_key>",
  "dilithium_public_key": "<base64_encoded_public_key>"
}
```

---

### Chat & Message Routes

**Prefix:** `/api/v1`

---

#### `GET /api/v1/messages/{peer_id}`

Retrieves the full message history between the authenticated user and a peer. Requires authentication cookie.

**Path Parameter:** `peer_id` — MongoDB ObjectId of the peer

**Response:**
```json
[
  {
    "_id": "...",
    "sender_id": "...",
    "receiver_id": "...",
    "message_type": "encrypted",
    "ciphertext": "<base64_kyber_ciphertext>",
    "encrypted_message": "<base64_aes_ciphertext>",
    "iv": "<base64_iv>",
    "signature": "<base64_dilithium_signature>",
    "timestamp": "2025-01-01T12:00:00Z"
  }
]
```

For file messages, the response includes:
```json
{
  "fileKyberCiphertext": "...",
  "encryptedFileData": "...",
  "fileIv": "...",
  "fileSignature": "...",
  "fileName": "document.pdf",
  "fileMime": "application/pdf",
  "message_type": "encrypted-file"
}
```

---

### Cloudinary Routes

**Prefix:** `/api/v1`

---

#### `GET /api/v1/cloudinary-signature`

Returns a signed upload signature for Cloudinary (for client-side signed uploads). Requires authentication.

**Response:**
```json
{
  "timestamp": 1234567890,
  "signature": "...",
  "api_key": "...",
  "cloud_name": "..."
}
```

---

### WebSocket Endpoints

#### `WSS /api/v1/ws/chat`

Main real-time chat WebSocket. Requires `access_token` cookie.

**Connection flow:**
1. Client connects → server authenticates via cookie
2. Server sends: `STATUS:✅ Connected successfully`
3. Client sends JSON messages

**Incoming message types (client → server):**

**Text Message:**
```json
{
  "type": "encrypted-message",
  "ciphertext": "<base64_kyber_ciphertext>",
  "encryptedMessage": "<base64_aes_ciphertext>",
  "iv": "<base64_iv>",
  "signature": "<base64_dilithium_signature>",
  "from": "<sender_user_id>",
  "to": "<receiver_user_id>"
}
```

**File Message:**
```json
{
  "type": "encrypted-file",
  "fileKyberCiphertext": "<base64>",
  "encryptedFileData": "<base64>",
  "fileIv": "<base64>",
  "fileSignature": "<base64>",
  "fileName": "image.png",
  "fileMime": "image/png",
  "from": "<sender_user_id>",
  "to": "<receiver_user_id>"
}
```

**Pair Request:**
```json
{
  "type": "pair",
  "to": "<receiver_user_id>"
}
```

**Keepalive:**
```json
{ "type": "ping" }
```

**Outgoing STATUS messages (server → client):**
- `STATUS:✅ Connected successfully`
- `STATUS:✅ Message delivered`
- `STATUS:❌ User {id} is not online`
- `STATUS:❌ Sender ID mismatch`
- `STATUS:❌ Missing fields: {field_list}`

---

#### `WSS /api/v1/ws/test`

Unauthenticated test WebSocket endpoint. Echoes all received text messages. Useful for connection debugging.

---

## 🧪 PQC Playground

Navigate to `/playground` to access the interactive cryptography visualizer.

The playground simulates the full 7-phase PQC communication pipeline with animated, step-by-step visualizations:

| Phase | Description |
|-------|-------------|
| **Phase 1** | ML-KEM-768 key exchange — public keys swapped, ciphertext + shared secret generated |
| **Phase 2** | AES-256-GCM message encryption using the shared secret |
| **Phase 3** | ML-DSA-65 digital signature generation |
| **Phase 4** | Secure transmission of the complete cryptographic payload |
| **Phase 5** | ML-KEM-768 decapsulation — receiver recovers shared secret |
| **Phase 6** | AES-256-GCM message decryption |
| **Phase 7** | ML-DSA-65 signature verification + complete communication summary |

All values in the playground are **mock / simulated** — no real cryptography is performed. It is purely educational.

---

## 🔒 Security Model

### What is protected
- All message content is encrypted **client-side** before transmission
- The server stores only **ciphertext** — it cannot read messages
- Every message carries a **Dilithium signature** verifiable by the recipient
- Private keys **never leave the browser** (stored in localStorage / IndexedDB)
- Authentication is **passwordless** via WebAuthn — no passwords to steal

### Threat model
| Threat | Mitigation |
|--------|-----------|
| Server compromise | Server never holds plaintext or private keys |
| Man-in-the-middle | ML-KEM-768 per-message key exchange; signature verification |
| Quantum adversary | ML-KEM-768 + ML-DSA-65 are NIST PQC standards |
| Replay attacks | Per-message unique IV and Kyber ciphertext |
| Impersonation | Dilithium signature verified against stored public key |
| Session hijacking | HttpOnly JWT cookie; short-lived challenges |

### What is NOT protected
- **Metadata** (who talks to whom, timestamps) is visible to the server
- **Key storage** relies on browser security — if the device is compromised, private keys may be extracted
- No **perfect forward secrecy** across sessions (keys are long-lived)

---

## ⚠️ Known Limitations

- File size is limited by WebSocket message size limits (~16 MB recommended max)
- The Cloudinary route generates signatures but the current file transfer implementation bypasses CDN for a direct base64 WebSocket transfer
- `FRONTEND_ORIGIN` in `.env` must exactly match the browser's origin for WebAuthn to work (including `https://`)
- WebAuthn requires **HTTPS** — the app will not work over plain HTTP
- Mobile browser support for WebAuthn varies; desktop Chrome/Firefox/Edge recommended

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# Fork the repository and create a branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git commit -m "feat: describe your change"

# Push and open a Pull Request
git push origin feature/your-feature-name
```

### Code style
- **Python:** PEP 8, type hints encouraged
- **JavaScript/JSX:** ESLint config included (`eslint.config.js`)
- **Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [CRYSTALS-Kyber / ML-KEM](https://pq-crystals.org/kyber/) — NIST PQC standard KEM
- [CRYSTALS-Dilithium / ML-DSA](https://pq-crystals.org/dilithium/) — NIST PQC standard signature scheme
- [@noble/post-quantum](https://github.com/paulmillr/noble-post-quantum) — Pure JS PQC implementation
- [SimpleWebAuthn](https://simplewebauthn.dev/) — WebAuthn browser & server libraries
- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [shadcn/ui](https://ui.shadcn.com/) — Accessible UI component system

---

<div align="center">

**Built with 🔐 post-quantum cryptography and a lot of ☕**

*ADSEC-COM — Classified Access Only*

</div>