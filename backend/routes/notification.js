const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifUser } = require('../middlewares/auth');

router.use(verifUser);

router.get('/notifications', notificationController.getNotifications);
router.get('/notifications/unread-count', notificationController.getUnreadCount);
router.get('/notifications/recent', notificationController.getRecentNotifications);
router.post('/notifications/read', notificationController.markAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);
router.delete('/notifications', notificationController.clearAll);
router.post('/notifications', notificationController.createNotification);

module.exports = router;
