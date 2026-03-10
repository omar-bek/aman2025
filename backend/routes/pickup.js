const express = require('express');
const router = express.Router();
const {
  getPickups,
  getPickup,
  createPickup,
  updatePickup,
  approvePickup,
  verifyPickup,
  cancelPickup
} = require('../controllers/pickup');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getPickups)
  .post(protect, authorize('parent', 'admin'), createPickup);

router.route('/:id')
  .get(protect, getPickup)
  .put(protect, updatePickup);

router.put('/:id/approve', protect, authorize('admin', 'staff'), approvePickup);
router.put('/:id/verify', protect, authorize('admin', 'staff'), verifyPickup);
router.put('/:id/cancel', protect, cancelPickup);

module.exports = router;
