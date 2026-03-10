const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMyDay,
  getProgressSummary,
  getTodayEvents,
} = require('../controllers/student');

// All routes here are for the logged-in student role
router.get('/my-day', protect, authorize('parent', 'student', 'teacher', 'admin', 'staff', 'driver'), getMyDay);
router.get('/progress', protect, authorize('student'), getProgressSummary);
router.get('/events/today', protect, authorize('student'), getTodayEvents);

module.exports = router;

