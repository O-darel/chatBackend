const crypto = require("crypto");
const pool = require("../config/db");
const userService = require("./userService");

class ChatService {
  async generateKeyPair() {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        "rsa",
        {
          modulusLength: 2048,
          publicKeyEncoding: { type: "spki", format: "pem" },
          privateKeyEncoding: { type: "pkcs8", format: "pem" },
        },
        (err, publicKey, privateKey) => {
          if (err) reject(err);
          resolve({ publicKey, privateKey });
        }
      );
    });
  }

  async initiateChat(senderId, recipientCodename) {
    const recipient = await userService.getUserByCodename(recipientCodename);
    if (!recipient) throw new Error("Recipient not found");

    const { publicKey, privateKey } = await this.generateKeyPair();
    const result = await pool.query(
      "INSERT INTO chat_sessions (sender_id, recipient_id, sender_public_key, sender_private_key) VALUES (?, ?, ?, ?)",
      [senderId, recipient.id, publicKey, privateKey]
    );
    return { sessionId: result.insertId, recipientId: recipient.id };
  }

  async sendMessage(senderId, recipientCodename, content) {
    const recipient = await userService.getUserByCodename(recipientCodename);
    if (!recipient) throw new Error("Recipient not found");

    const [sessions] = await pool.query(
      "SELECT sender_public_key, sender_private_key FROM chat_sessions WHERE sender_id = ? AND recipient_id = ?",
      [senderId, recipient.id]
    );
    if (!sessions[0]) throw new Error("Chat session not found");

    const { sender_public_key, sender_private_key } = sessions[0];
    const encryptedContent = crypto
      .publicEncrypt(sender_public_key, Buffer.from(content))
      .toString("base64");

    const [result] = await pool.query(
      "INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)",
      [senderId, recipient.id, encryptedContent]
    );

    return { messageId: result.insertId, content: encryptedContent };
  }

  async getMessages(userId, recipientCodename) {
    const recipient = await userService.getUserByCodename(recipientCodename);
    if (!recipient) throw new Error("Recipient not found");

    const [messages] = await pool.query(
      "SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY created_at ASC",
      [userId, recipient.id, recipient.id, userId]
    );

    const [sessions] = await pool.query(
      "SELECT sender_id, recipient_id, sender_private_key FROM chat_sessions WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)",
      [userId, recipient.id, recipient.id, userId]
    );

    return messages.map((msg) => {
      const session = sessions.find(
        (s) =>
          s.sender_id === msg.sender_id && s.recipient_id === msg.recipient_id
      );
      if (!session || !session.sender_private_key) {
        return { ...msg, content: "[Could not decrypt]" };
      }

      try {
        const decrypted = crypto
          .privateDecrypt(
            session.sender_private_key,
            Buffer.from(msg.content, "base64")
          )
          .toString();
        return { ...msg, content: decrypted };
      } catch (err) {
        return { ...msg, content: "[Decryption failed]" };
      }
    });
  }
}

module.exports = new ChatService();
