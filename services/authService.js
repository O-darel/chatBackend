const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

class AuthService {
  async signup({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return { id: result.insertId, username, email };
  }

  async login({ email, password }) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }

  async resetPassword({ email, newPassword }) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query('UPDATE users SET password = ? WHERE email = ?', [
      hashedPassword,
      email,
    ]);
    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }
  }
}

module.exports = new AuthService();