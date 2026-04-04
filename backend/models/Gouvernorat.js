const db = require('../config/db');

class Gouvernorat {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM gouvernorats ORDER BY nom');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM gouvernorats WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { nom, image } = data;
    const [result] = await db.query(
      'INSERT INTO gouvernorats (nom, image) VALUES (?, ?)',
      [nom, image || null]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const allowedFields = ['nom', 'image'];
    const entries = Object.entries(updates).filter(([key]) => allowedFields.includes(key));
    if (entries.length === 0) return false;

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, val]) => val);
    values.push(id);

    const [result] = await db.query(`UPDATE gouvernorats SET ${setClause} WHERE id = ?`, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM gouvernorats WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Gouvernorat;