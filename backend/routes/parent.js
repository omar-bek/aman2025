const express = require('express');
const router = express.Router();
const { getParentDashboard } = require('../controllers/parent');
const { protect, authorize } = require('../middleware/auth');

// Parent daily assurance dashboard
router.get('/dashboard', protect, authorize('parent'), getParentDashboard);

module.exports = router;

