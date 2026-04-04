const db = require('../config/db');

class Paiement {
  static async create(data) {
    const { id_reservation, id_abonnement, montant, type, statut = 'NON_PAYE', date_paiement = null } = data;
    const [result] = await db.query(
      `INSERT INTO paiements (id_reservation, id_abonnement, montant, type, statut, date_paiement)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_reservation || null, id_abonnement || null, montant, type, statut, date_paiement]
    );
    return result.insertId;
  }

  static async markAsPaid(id) {
    const [result] = await db.query(
      'UPDATE paiements SET statut = "PAYE", date_paiement = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findByReservation(reservationId) {
    const [rows] = await db.query('SELECT * FROM paiements WHERE id_reservation = ?', [reservationId]);
    return rows[0];
  }

  static async findByAbonnement(abonnementId) {
    const [rows] = await db.query('SELECT * FROM paiements WHERE id_abonnement = ?', [abonnementId]);
    return rows[0];
  }
}

module.exports = Paiement;