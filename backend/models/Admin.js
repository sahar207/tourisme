const db = require('../config/db');

class Admin {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM utilisateurs WHERE id = ? AND role = "ADMIN"', [id]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM utilisateurs WHERE role = "ADMIN"');
    return rows;
  }

  static async create(adminData) {
    const { nom_complet, email, mot_de_passe } = adminData;
    const [result] = await db.query(
      `INSERT INTO utilisateurs (nom_complet, email, mot_de_passe, role, verified, est_actif)
       VALUES (?, ?, ?, 'ADMIN', 1, 1)`,
      [nom_complet, email, mot_de_passe]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const allowedFields = ['nom_complet', 'email', 'mot_de_passe', 'verified', 'est_actif'];
    const entries = Object.entries(updates).filter(([key]) => allowedFields.includes(key));
    if (entries.length === 0) return false;

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, val]) => val);
    values.push(id);

    const [result] = await db.query(`UPDATE utilisateurs SET ${setClause} WHERE id = ? AND role = 'ADMIN'`, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM utilisateurs WHERE id = ? AND role = "ADMIN"', [id]);
    return result.affectedRows > 0;
  }

  static async getStats() {
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM utilisateurs WHERE role = 'GUIDE') as total_guides,
        (SELECT COUNT(*) FROM utilisateurs WHERE role = 'GUIDE' AND est_actif = 1) as active_guides,
        (SELECT COUNT(*) FROM utilisateurs WHERE role = 'GUIDE' AND est_actif = 0) as inactive_guides,
        (SELECT COUNT(*) FROM utilisateurs WHERE role = 'TOURISTE') as total_tourists,
        (SELECT COUNT(*) FROM plans_touristiques) as total_plans,
        (SELECT COUNT(*) FROM reservations) as total_reservations
    `);
    return stats[0];
  }

  static async getRecentActivity(limit = 10) {
    const [activities] = await db.query(`
      SELECT 
        u.nom_complet,
        u.role,
        'login' as activity_type,
        u.last_login as created_at
      FROM utilisateurs u 
      WHERE u.last_login IS NOT NULL 
      ORDER BY u.last_login DESC 
      LIMIT ?
    `, [limit]);
    return activities;
  }
}

module.exports = Admin;
