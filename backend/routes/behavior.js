const express = require('express');
const router = express.Router();
const {
  getBehaviors,
  getBehavior,
  createBehavior,
  updateBehavior,
  deleteBehavior
} = require('../controllers/behavior');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getBehaviors)
  .post(protect, authorize('teacher', 'admin', 'staff'), createBehavior);

router.route('/:id')
  .get(protect, getBehavior)
  .put(protect, authorize('teacher', 'admin', 'staff'), updateBehavior)
  .delete(protect, authorize('admin'), deleteBehavior);

module.exports = router;
