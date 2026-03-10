const express = require('express');
const router = express.Router();
const {
  getBuses,
  getBus,
  createBus,
  updateBus,
  deleteBus,
  updateBusLocation,
  getBusStudents
} = require('../controllers/buses');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getBuses)
  .post(protect, authorize('admin'), createBus);

router.route('/:id')
  .get(protect, getBus)
  .put(protect, authorize('admin'), updateBus)
  .delete(protect, authorize('admin'), deleteBus);

router.put('/:id/location', protect, authorize('driver', 'admin'), updateBusLocation);
router.get('/:id/students', protect, getBusStudents);

module.exports = router;
