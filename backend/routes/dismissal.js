const express = require('express');
const router = express.Router();
const {
  getDismissals,
  getDismissal,
  createDismissal,
  updateDismissal,
  approveDismissalTeacher,
  approveDismissalAdmin,
  completeDismissal,
  cancelDismissal
} = require('../controllers/dismissal');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getDismissals)
  .post(protect, authorize('parent', 'admin'), createDismissal);

router.route('/:id')
  .get(protect, getDismissal)
  .put(protect, updateDismissal);

router.put('/:id/approve-teacher', protect, authorize('teacher'), approveDismissalTeacher);
router.put('/:id/approve-admin', protect, authorize('admin', 'staff'), approveDismissalAdmin);
router.put('/:id/complete', protect, authorize('admin', 'staff'), completeDismissal);
router.put('/:id/cancel', protect, cancelDismissal);

module.exports = router;
