const express = require('express');
const router = express.Router();

const {
  getMessages,
  sendMessage,
  getStudentMessages,
  getMessageById,
  markAsRead,
  getUnreadCount
} = require('../controllers/teacherMessages');
const { getClassInsights } = require('../controllers/teacherInsights');
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getSubmissions,
  gradeSubmission,
  getTodayAssignmentCount,
} = require('../controllers/teacherAssignments');

const { protect, authorize } = require('../middleware/auth');

// All teacher-related routes require authentication
router.use(protect);

// Messaging endpoints – accessible to teachers and parents (and admins/staff if needed)
router
  .route('/messages/')
  .get(authorize('teacher', 'parent', 'admin', 'staff'), getMessages)
  .post(authorize('teacher', 'parent'), sendMessage);

router.get(
  '/messages/student/:studentId',
  authorize('teacher', 'parent', 'admin', 'staff'),
  getStudentMessages
);

router.get(
  '/messages/unread/count',
  authorize('teacher', 'parent', 'admin', 'staff'),
  getUnreadCount
);

router.get(
  '/messages/:id',
  authorize('teacher', 'parent', 'admin', 'staff'),
  getMessageById
);

// Support both PUT and POST for marking as read to match different frontend usages
router.put(
  '/messages/:id/read',
  authorize('teacher', 'parent', 'admin', 'staff'),
  markAsRead
);

router.post(
  '/messages/:id/read',
  authorize('teacher', 'parent', 'admin', 'staff'),
  markAsRead
);

// Class insights – teacher and admin/staff
router.get(
  '/class-insights',
  authorize('teacher', 'admin', 'staff'),
  getClassInsights
);

// Assignment management (minimal stub implementation)
router
  .route('/assignments/')
  .get(authorize('teacher'), getAssignments)
  .post(authorize('teacher'), createAssignment);

router
  .route('/assignments/:id')
  .get(authorize('teacher'), getAssignmentById)
  .put(authorize('teacher'), updateAssignment)
  .delete(authorize('teacher'), deleteAssignment);

router.get(
  '/assignments/:assignmentId/submissions',
  authorize('teacher'),
  getSubmissions
);

router.put(
  '/assignments/submissions/:submissionId',
  authorize('teacher'),
  gradeSubmission
);

router.get(
  '/assignments/today/count',
  authorize('teacher'),
  getTodayAssignmentCount
);

module.exports = router;
