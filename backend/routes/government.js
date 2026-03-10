const express = require('express');
const router = express.Router();
const { getAttendanceTrends } = require('../controllers/government');
const { protect, authorize } = require('../middleware/auth');

// All government analytics routes are protected and limited to high-level roles only
router.get(
  '/attendance-trends',
  protect,
  authorize('super_admin', 'government_admin', 'authority_admin'),
  getAttendanceTrends
);

module.exports = router;

