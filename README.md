# 📩 ChatBackend

A simple, secure messaging API built with Node.js, Express, MySQL, and JWT authentication. Messages are encrypted using RSA to ensure privacy between users.

---

## 🔐 Features

- User authentication with **JWT**
- Store and retrieve user messages securely
- **Public-key encryption** (RSA) for message confidentiality
- RESTful API endpoints
- MySQL database integration

---

## 🛠 Tech Stack

- **Backend:** Node.js + Express
- **Database:** MySQL
- **Auth:** JSON Web Tokens (JWT)
- **Encryption:** RSA (asymmetric encryption via Node's `crypto` module)

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/chatBackend.git
cd chatBackend
npm install
````

---

## 🔧 Configuration

Create a `.env` file in the root directory with the following:

```env
DATABASE_HOST=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
JWT_SECRET=
PORT=3000
```

---

## ▶️ Running the Server

```bash
npm start
```

Server runs on: `http://localhost:3000`

---

## 🧪 API Overview

### Auth

* `POST /api/v1/auth/register` – Register a new user
* `POST /api/v1/auth/login` – Login and receive JWT

### Users

* `GET /api/v1/user/profile` – Get current user's profile (requires token)

### Chat

* `POST /api/v1/chat/initiate` – Start a chat session with another user (by codename)
* `POST /api/v1/chat/send` – Send an encrypted message
* `GET /api/v1/chat/messages/:codename` – Fetch and decrypt chat messages

---

## 🔒 Encryption Logic

* A unique RSA key pair is generated per chat session.
* Messages are encrypted with the recipient’s **public key**.
* Decryption is done using the matching **private key** stored with the session.

> ⚠️ **Note:** In production, private keys should be stored securely, not in plain text.

---

## 📂 Project Structure

```
chatBackend/
│
├── controllers/       # Route controllers
├── middlewares/       # Custom Express middlewares (e.g., auth, error handler)
├── routes/            # API route definitions
├── services/          # Business logic layer
├── config/            # DB and server config
├── .env               # Environment variables
└── server.js          # Main entry point
```

---

## ✅ Todo

* Add rate limiting
* Encrypt private keys at rest
* Add typing indicators or online presence
* Improve session management

---

## 📄 License

MIT

---
