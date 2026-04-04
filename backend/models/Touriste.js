const db = require('../config/db');

class Touriste {
  static async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM touristes WHERE id_utilisateur = ?', [userId]);
    return rows[0];
  }

  static async create(userId, data = {}) {
    const { nationalite, telephone } = data;
    const [result] = await db.query(
      'INSERT INTO touristes (id_utilisateur, nationalite, telephone) VALUES (?, ?, ?)',
      [userId, nationalite || null, telephone || null]
    );
    return result.affectedRows > 0;
  }

  static async update(userId, updates) {
    const allowedFields = ['nationalite', 'telephone'];
    const entries = Object.entries(updates).filter(([key]) => allowedFields.includes(key));
    if (entries.length === 0) return false;

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, val]) => val);
    values.push(userId);

    const [result] = await db.query(`UPDATE touristes SET ${setClause} WHERE id_utilisateur = ?`, values);
    return result.affectedRows > 0;
  }
}

module.exports = Touriste;