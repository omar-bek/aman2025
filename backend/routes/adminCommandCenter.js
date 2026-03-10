const express = require('express');
const router = express.Router();
const { getDashboard, getIncidents } = require('../controllers/adminCommandCenter');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin', 'staff'));

router.get('/dashboard', getDashboard);
router.get('/incidents', getIncidents);

module.exports = router;

