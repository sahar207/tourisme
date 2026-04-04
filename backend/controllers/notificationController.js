const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Get all notifications for a user
 */
exports.getNotifications = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const notifications = await Notification.findByUser(userId);
    
    res.render('notifications', {
      user: req.session.user,
      notifications,
      layout: 'minimal'
    });
  } catch (err) {
    console.error('Error getting notifications:', err);
    res.status(500).send('Server error');
  }
};

/**
 * Get unread notifications count
 */
exports.getUnreadCount = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const count = await Notification.getUnreadCount(userId);
    res.json({ count });
  } catch (err) {
    console.error('Error getting unread count:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Mark notifications as read
 */
exports.markAsRead = async (req, res) => {
  const userId = req.session.user.id;
  const { notificationIds } = req.body;

  try {
    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await Promise.all(
        notificationIds.map(id => Notification.markAsRead(id))
      );
    } else {
      // Mark all notifications as read for this user
      await Notification.markAllAsRead(userId);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notifications as read:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete a notification
 */
exports.deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.session.user.id;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user owns this notification
    if (notification.id_utilisateur !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Notification.delete(notificationId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Create a new notification
 */
exports.createNotification = async (req, res) => {
  const { id_utilisateur, type, contenu } = req.body;

  try {
    const notificationId = await Notification.create({
      id_utilisateur,
      type,
      contenu
    });

    res.json({ success: true, notificationId });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get recent notifications for dashboard
 */
exports.getRecentNotifications = async (req, res) => {
  const userId = req.session.user.id;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const notifications = await Notification.findByUser(userId, limit);
    res.json(notifications);
  } catch (err) {
    console.error('Error getting recent notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Clear all notifications for a user
 */
exports.clearAll = async (req, res) => {
  const userId = req.session.user.id;

  try {
    await Notification.clearAllForUser(userId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
