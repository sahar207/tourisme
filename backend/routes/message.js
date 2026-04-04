const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifUser } = require('../middlewares/auth');

router.use(verifUser);

router.get('/messages', messageController.getConversations);
router.get('/messages/:userId', messageController.getConversation);
router.post('/messages', messageController.sendMessage);
router.get('/messages/:userId/new', messageController.getNewMessages);
router.delete('/messages/:id', messageController.deleteMessage);
router.get('/messages/search', messageController.searchMessages);
router.get('/messages/unread-count', messageController.getUnreadCount);

module.exports = router;
