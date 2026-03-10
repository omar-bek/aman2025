const express = require('express');
const router = express.Router();
const {
  getRoute,
  getTodayStats,
  sendEmergency,
  startRoute,
  endRoute,
  getActiveRoute,
  arriveAtStop,
  getRouteSummary,
} = require('../controllers/driver');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('driver'));

router.get('/route', getRoute);
router.get('/stats/today', getTodayStats);
router.post('/emergency', sendEmergency);
router.post('/route/start', startRoute);
router.post('/route/end', endRoute);
router.get('/route/active', getActiveRoute);
router.post('/route/stop/:stopId/arrive', arriveAtStop);
router.get('/route/latest/summary', getRouteSummary);
router.get('/route/:routeId/summary', getRouteSummary);

module.exports = router;

