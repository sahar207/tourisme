const db = require('../config/db');

class Message {
  static async create(data) {
    const { id_expediteur, id_destinataire, contenu } = data;
    const [result] = await db.query(
      'INSERT INTO messages (id_expediteur, id_destinataire, contenu) VALUES (?, ?, ?)',
      [id_expediteur, id_destinataire, contenu]
    );
    return result.insertId;
  }

  static async findConversation(user1Id, user2Id) {
    const [rows] = await db.query(
      `SELECT m.*, u.nom_complet as sender_name
       FROM messages m
       JOIN utilisateurs u ON m.id_expediteur = u.id
       WHERE (m.id_expediteur = ? AND m.id_destinataire = ?)
          OR (m.id_expediteur = ? AND m.id_destinataire = ?)
       ORDER BY m.date_creation ASC`,
      [user1Id, user2Id, user2Id, user1Id]
    );
    return rows;
  }

  static async markAsRead(expediteurId, destinataireId) {
    const [result] = await db.query(
      'UPDATE messages SET est_lu = 1 WHERE id_expediteur = ? AND id_destinataire = ?',
      [expediteurId, destinataireId]
    );
    return result.affectedRows;
  }

  static async getUnreadCount(userId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM messages WHERE id_destinataire = ? AND est_lu = 0',
      [userId]
    );
    return rows[0].count;
  }

  static async getLastMessagesForUser(userId) {
    const [rows] = await db.query(
      `SELECT m.*,
              u.nom_complet as other_user_name,
              u.id as other_user_id
       FROM messages m
       JOIN utilisateurs u ON (CASE WHEN m.id_expediteur = ? THEN m.id_destinataire ELSE m.id_expediteur END) = u.id
       WHERE m.id IN (
         SELECT MAX(id) FROM messages
         WHERE id_expediteur = ? OR id_destinataire = ?
         GROUP BY LEAST(id_expediteur, id_destinataire), GREATEST(id_expediteur, id_destinataire)
       )
       ORDER BY m.date_creation DESC`,
      [userId, userId, userId]
    );
    return rows;
  }
}

module.exports = Message;