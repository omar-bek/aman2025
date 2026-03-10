const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getNotifications);

router.route('/:id')
  .get(protect, getNotification)
  .delete(protect, deleteNotification);

// Support both PUT (as documented) and POST (as used by frontend) for marking notifications as read
router.put('/:id/read', protect, markAsRead);
router.post('/:id/read', protect, markAsRead);

// Support both PUT and POST for marking all as read
router.put('/read-all', protect, markAllAsRead);
router.post('/read-all', protect, markAllAsRead);

module.exports = router;
