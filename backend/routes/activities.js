const express = require('express');
const router = express.Router();
const {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  registerStudent
} = require('../controllers/activities');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getActivities)
  .post(protect, authorize('teacher', 'admin', 'staff'), createActivity);

router.route('/:id')
  .get(protect, getActivity)
  .put(protect, authorize('teacher', 'admin', 'staff'), updateActivity)
  .delete(protect, authorize('admin'), deleteActivity);

router.post('/:id/register', protect, authorize('parent', 'admin'), registerStudent);

module.exports = router;
