const pool = require('../config/db');

class UserService {
  async updateProfile(userId, { codename }) {
    await pool.query('UPDATE users SET codename = ? WHERE id = ?', [codename, userId]);
    return { codename };
  }

  async getUserProfile(userId){
    const [rows]=await pool.query('SELECT codename,id FROM users WHERE id = ?', [userId]);
    return rows[0];
  }

  async getUserByCodename(codename) {
    const [rows] = await pool.query('SELECT id, codename FROM users WHERE codename = ?', [
      codename,
    ]);
    return rows[0];
    
  }
}

module.exports = new UserService();