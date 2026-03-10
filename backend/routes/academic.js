const express = require('express');
const router = express.Router();
const {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  getExams,
  createExam,
  updateExam,
  deleteExam,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/academic');
const { protect, authorize } = require('../middleware/auth');

// Grades routes
router.route('/grades')
  .get(protect, getGrades)
  .post(protect, authorize('teacher', 'admin'), createGrade);

router.route('/grades/:id')
  .put(protect, authorize('teacher', 'admin'), updateGrade)
  .delete(protect, authorize('teacher', 'admin'), deleteGrade);

// Exams routes
router.route('/exams')
  .get(protect, getExams)
  .post(protect, authorize('teacher', 'admin'), createExam);

router.route('/exams/:id')
  .put(protect, authorize('teacher', 'admin'), updateExam)
  .delete(protect, authorize('teacher', 'admin'), deleteExam);

// Assignments routes
router.route('/assignments')
  .get(protect, getAssignments)
  .post(protect, authorize('teacher', 'admin'), createAssignment);

router.route('/assignments/:id')
  .put(protect, authorize('teacher', 'admin'), updateAssignment)
  .delete(protect, authorize('teacher', 'admin'), deleteAssignment);

module.exports = router;
