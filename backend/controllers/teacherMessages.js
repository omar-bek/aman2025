const TeacherMessage = require('../models/TeacherMessage');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Normalize Mongo document to the shape expected by the frontend TeacherMessages page
const serializeMessage = (doc) => {
  if (!doc) return null;

  const plain = doc.toObject({ virtuals: true });

  return {
    id: plain._id,
    student_id: plain.studentId,
    student_name: plain.student?.name || plain.student_name,
    parent_name: plain.parent?.name || plain.parent_name,
    message: plain.message,
    sender_role: plain.senderRole,
    created_at: plain.createdAt,
    is_read: plain.isRead
  };
};

// @desc    Get messages for teacher/parent
// @route   GET /api/teacher/messages
// @access  Private (teacher/parent/admin/staff)
exports.getMessages = asyncHandler(async (req, res, next) => {
  const { student_id, parent_id, unread_only, page = 1, limit = 100 } = req.query;

  const query = {};

  if (student_id) {
    query.studentId = student_id;
  }

  if (parent_id) {
    query.parentId = parent_id;
  }

  if (unread_only === 'true') {
    query.isRead = false;
  }

  if (req.user.role === 'teacher') {
    query.teacherId = req.user._id;
  } else if (req.user.role === 'parent') {
    query.parentId = req.user._id;
  }

  const pageInt = parseInt(page, 10) || 1;
  const limitInt = Math.min(parseInt(limit, 10) || 100, 500);
  const skip = (pageInt - 1) * limitInt;

  const [messages, total] = await Promise.all([
    TeacherMessage.find(query)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limitInt)
      .populate('studentId', 'name')
      .populate('parentId', 'name'),
    TeacherMessage.countDocuments(query),
  ]);

  const serialized = messages.map((m) => serializeMessage(m));

  res.status(200).json({
    success: true,
    count: serialized.length,
    total,
    page: pageInt,
    limit: limitInt,
    data: serialized,
  });
});

// @desc    Send message between teacher and parent
// @route   POST /api/teacher/messages
// @access  Private (teacher/parent)
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { student_id, parent_id, message } = req.body;

  if (!student_id || !message) {
    return next(new ErrorResponse('student_id and message are required', 400));
  }

  const student = await Student.findById(student_id).populate('parentIds');

  if (!student) {
    return next(new ErrorResponse('Student not found', 404));
  }

  let teacherId = null;
  let parentId = null;
  let senderRole = null;

  if (req.user.role === 'teacher') {
    teacherId = req.user._id;
    // If explicit parent_id is provided use it, otherwise fall back to first parent on the student
    parentId = parent_id || (student.parentIds && student.parentIds[0] ? student.parentIds[0]._id || student.parentIds[0] : null);
    senderRole = 'teacher';
  } else if (req.user.role === 'parent') {
    parentId = req.user._id;
    teacherId = student.teacherId;
    senderRole = 'parent';
  } else {
    return next(new ErrorResponse('Only teachers and parents can send messages', 403));
  }

  if (!teacherId) {
    return next(new ErrorResponse('Student does not have an assigned teacher', 400));
  }

  const newMessage = await TeacherMessage.create({
    studentId: student._id,
    teacherId,
    parentId,
    message,
    senderRole
  });

  const populated = await newMessage
    .populate('studentId', 'name')
    .populate('parentId', 'name');

  res.status(201).json(serializeMessage(populated));
});

// @desc    Get messages for a specific student
// @route   GET /api/teacher/messages/student/:studentId
// @access  Private
exports.getStudentMessages = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;

  const query = { studentId };

  if (req.user.role === 'teacher') {
    query.teacherId = req.user._id;
  } else if (req.user.role === 'parent') {
    query.parentId = req.user._id;
  }

  const messages = await TeacherMessage.find(query)
    .sort({ createdAt: 1 })
    .populate('studentId', 'name')
    .populate('parentId', 'name');

  const serialized = messages.map((m) => serializeMessage(m));

  res.status(200).json(serialized);
});

// @desc    Get single message
// @route   GET /api/teacher/messages/:id
// @access  Private
exports.getMessageById = asyncHandler(async (req, res, next) => {
  const msg = await TeacherMessage.findById(req.params.id)
    .populate('studentId', 'name')
    .populate('parentId', 'name');

  if (!msg) {
    return next(new ErrorResponse('Message not found', 404));
  }

  // Ensure user is part of the conversation
  if (
    req.user.role === 'teacher' &&
    msg.teacherId.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  if (
    req.user.role === 'parent' &&
    msg.parentId &&
    msg.parentId.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  res.status(200).json(serializeMessage(msg));
});

// @desc    Mark message as read
// @route   PUT/POST /api/teacher/messages/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const msg = await TeacherMessage.findById(req.params.id)
    .populate('studentId', 'name')
    .populate('parentId', 'name');

  if (!msg) {
    return next(new ErrorResponse('Message not found', 404));
  }

  // Only the receiver should mark as read; in practice we only enforce that user is part of the conversation
  if (
    req.user.role === 'teacher' &&
    msg.teacherId.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  if (
    req.user.role === 'parent' &&
    msg.parentId &&
    msg.parentId.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  msg.isRead = true;
  msg.readAt = new Date();
  await msg.save();

  res.status(200).json(serializeMessage(msg));
});

// @desc    Get unread messages count for current user
// @route   GET /api/teacher/messages/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const query = { isRead: false };

  if (req.user.role === 'teacher') {
    query.teacherId = req.user._id;
  } else if (req.user.role === 'parent') {
    query.parentId = req.user._id;
  }

  const count = await TeacherMessage.countDocuments(query);

  res.status(200).json({ count });
});

