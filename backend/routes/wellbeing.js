const express = require('express');
const router = express.Router();
const { createCheckin } = require('../controllers/wellbeing');
const { protect, authorize } = require('../middleware/auth');

router.post('/student/checkin', protect, authorize('student'), createCheckin);

module.exports = router;

