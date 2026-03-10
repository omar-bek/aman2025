const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  getStudentGrades,
  getStudentBehavior
} = require('../controllers/students');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getStudents)
  .post(protect, authorize('admin', 'staff'), createStudent);

router.route('/:id')
  .get(protect, getStudent)
  .put(protect, authorize('admin', 'staff'), updateStudent)
  .delete(protect, authorize('admin'), deleteStudent);

router.get('/:id/attendance', protect, getStudentAttendance);
router.get('/:id/grades', protect, getStudentGrades);
router.get('/:id/behavior', protect, getStudentBehavior);

module.exports = router;
