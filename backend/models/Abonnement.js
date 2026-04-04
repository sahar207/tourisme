const db = require('../config/db');

class Abonnement {
  static async findByGuide(guideId) {
    const [rows] = await db.query('SELECT * FROM abonnements WHERE id_guide = ? ORDER BY date_fin DESC', [guideId]);
    return rows;
  }

  static async findActiveByGuide(guideId) {
    const [rows] = await db.query(
      'SELECT * FROM abonnements WHERE id_guide = ? AND statut = "ACTIF" AND date_fin >= CURDATE()',
      [guideId]
    );
    return rows[0];
  }

  static async create(data) {
    const { id_guide, date_debut, date_fin, statut = 'ACTIF' } = data;
    const [result] = await db.query(
      'INSERT INTO abonnements (id_guide, date_debut, date_fin, statut) VALUES (?, ?, ?, ?)',
      [id_guide, date_debut, date_fin, statut]
    );
    return result.insertId;
  }

  static async expire(id) {
    const [result] = await db.query('UPDATE abonnements SET statut = "EXPIRE" WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async expireAllPast() {
    const [result] = await db.query(
      'UPDATE abonnements SET statut = "EXPIRE" WHERE date_fin < CURDATE() AND statut = "ACTIF"'
    );
    return result.affectedRows;
  }
}

module.exports = Abonnement;