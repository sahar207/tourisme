const db = require('../config/db');

class Avis {
  static async findByGuide(guideId) {
    const [rows] = await db.query(
      `SELECT a.*, u.nom_complet as touriste_nom
       FROM avis a
       JOIN utilisateurs u ON a.id_touriste = u.id
       WHERE a.id_guide = ?
       ORDER BY a.date_creation DESC`,
      [guideId]
    );
    return rows;
  }

  static async create(data) {
    const { id_guide, id_touriste, note, commentaire } = data;
    const [result] = await db.query(
      'INSERT INTO avis (id_guide, id_touriste, note, commentaire) VALUES (?, ?, ?, ?)',
      [id_guide, id_touriste, note, commentaire]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const allowedFields = ['note', 'commentaire'];
    const entries = Object.entries(updates).filter(([key]) => allowedFields.includes(key));
    if (entries.length === 0) return false;

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, val]) => val);
    values.push(id);

    const [result] = await db.query(`UPDATE avis SET ${setClause} WHERE id = ?`, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM avis WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getAverageForGuide(guideId) {
    const [rows] = await db.query(
      'SELECT AVG(note) as moyenne FROM avis WHERE id_guide = ?',
      [guideId]
    );
    return rows[0].moyenne || 0;
  }
}

module.exports = Avis;