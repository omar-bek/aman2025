const express = require('express');
const router = express.Router();
const {
  getAttendance,
  createAttendance,
  getAttendanceByDate,
  getAttendanceStats,
  logAttendanceEvent,
  getStudentAttendance,
  getAttendanceLogsForStudent
} = require('../controllers/attendance');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAttendance)
  .post(protect, authorize('admin', 'staff', 'teacher'), createAttendance);

router.get('/date/:date', protect, getAttendanceByDate);
router.get('/stats', protect, getAttendanceStats);

// Extra routes used by the React frontend attendanceAPI
router.post('/log', protect, authorize('admin', 'staff', 'teacher', 'driver'), logAttendanceEvent);
router.get('/student/:studentId', protect, getStudentAttendance);
router.get('/logs/:studentId', protect, getAttendanceLogsForStudent);

module.exports = router;
