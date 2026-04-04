const db = require('../config/db');

class Notification {
  static async create(data) {
    const { id_utilisateur, type, contenu } = data;
    const [result] = await db.query(
      'INSERT INTO notifications (id_utilisateur, type, contenu) VALUES (?, ?, ?)',
      [id_utilisateur, type, contenu]
    );
    return result.insertId;
  }

  static async findByUser(userId, limit = 50) {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE id_utilisateur = ? ORDER BY date_creation DESC LIMIT ?',
      [userId, limit]
    );
    return rows;
  }

  static async markAsRead(userId, notificationId = null) {
    let query = 'UPDATE notifications SET est_vu = 1 WHERE id_utilisateur = ?';
    const params = [userId];
    if (notificationId) {
      query += ' AND id = ?';
      params.push(notificationId);
    }
    const [result] = await db.query(query, params);
    return result.affectedRows;
  }

  static async markAllAsRead(userId) {
    return this.markAsRead(userId);
  }

  static async getUnreadCount(userId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE id_utilisateur = ? AND est_vu = 0',
      [userId]
    );
    return rows[0].count;
  }

  static async deleteOldNotifications(days = 30) {
    const [result] = await db.query(
      'DELETE FROM notifications WHERE date_creation < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    );
    return result.affectedRows;
  }
}

module.exports = Notification;