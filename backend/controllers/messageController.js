const Message = require('../models/Message');
const User = require('../models/User');
const Guide = require('../models/Guide');

/**
 * Get all conversations for a user
 */
exports.getConversations = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const messages = await Message.getLastMessagesForUser(userId);
    
    // Enrich with user details
    const enriched = await Promise.all(
      messages.map(async (msg) => {
        const otherId = msg.other_user_id;
        const user = await User.findById(otherId);
        
        let guideStatus = null;
        if (user && user.role === 'GUIDE') {
          const guide = await Guide.findByUserId(otherId);
          guideStatus = guide ? guide.statut : null;
        }
        
        return { ...msg, other_user: user, guide_status: guideStatus };
      })
    );

    res.render('messages/conversations', {
      user: req.session.user,
      conversations: enriched,
      layout: 'minimal'
    });
  } catch (err) {
    console.error('Error getting conversations:', err);
    res.status(500).send('Server error');
  }
};

/**
 * Get conversation with a specific user
 */
exports.getConversation = async (req, res) => {
  const userId = req.session.user.id;
  const otherUserId = req.params.userId;

  try {
    // Mark messages as read
    await Message.markAsRead(otherUserId, userId);

    // Get conversation
    const messages = await Message.findConversation(userId, otherUserId);

    // Get other user details
    const otherUser = await User.findById(otherUserId);

    res.render('messages/conversation', {
      user: req.session.user,
      messages,
      otherUser,
      otherUserId,
      layout: 'minimal'
    });
  } catch (err) {
    console.error('Error getting conversation:', err);
    res.status(500).send('Server error');
  }
};

/**
 * Send a message
 */
exports.sendMessage = async (req, res) => {
  const senderId = req.session.user.id;
  const { id_destinataire, contenu } = req.body;

  try {
    const messageId = await Message.create({
      id_expediteur: senderId,
      id_destinataire,
      contenu: contenu.trim()
    });

    res.json({ success: true, messageId });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get new messages (for real-time updates)
 */
exports.getNewMessages = async (req, res) => {
  const userId = req.session.user.id;
  const otherUserId = req.params.userId;
  const lastMessageId = parseInt(req.query.lastMessageId) || 0;

  try {
    const messages = await Message.getNewMessages(userId, otherUserId, lastMessageId);
    res.json(messages);
  } catch (err) {
    console.error('Error getting new messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete a message
 */
exports.deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.session.user.id;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user owns this message
    if (message.id_expediteur !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Message.delete(messageId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Search messages
 */
exports.searchMessages = async (req, res) => {
  const userId = req.session.user.id;
  const { query } = req.query;

  try {
    const messages = await Message.searchMessages(userId, query);
    res.json(messages);
  } catch (err) {
    console.error('Error searching messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get unread messages count
 */
exports.getUnreadCount = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const count = await Message.getUnreadCount(userId);
    res.json({ count });
  } catch (err) {
    console.error('Error getting unread count:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
