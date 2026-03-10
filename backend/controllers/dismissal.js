const Dismissal = require('../models/Dismissal');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { logAudit } = require('../services/auditService');

// @desc    Get all dismissals
// @route   GET /api/dismissal
// @access  Private
exports.getDismissals = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'parent') {
    query.requestedBy = req.user._id;
  }

  const { studentId, status, dismissalDate, page = 1, limit = 50 } = req.query;
  if (studentId) query.studentId = studentId;
  if (status) query.status = status;
  if (dismissalDate) query.dismissalDate = new Date(dismissalDate);

  const pageInt = parseInt(page, 10) || 1;
  const limitInt = Math.min(parseInt(limit, 10) || 50, 200);
  const skip = (pageInt - 1) * limitInt;

  const [dismissals, total] = await Promise.all([
    Dismissal.find(query)
      .populate('studentId', 'name studentId grade class')
      .populate('requestedBy', 'name email phone')
      .populate('teacherApproval.approvedBy', 'name')
      .populate('adminApproval.approvedBy', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitInt),
    Dismissal.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: dismissals.length,
    total,
    page: pageInt,
    limit: limitInt,
    data: dismissals,
  });
});

// @desc    Get single dismissal
// @route   GET /api/dismissal/:id
// @access  Private
exports.getDismissal = asyncHandler(async (req, res, next) => {
  const dismissal = await Dismissal.findById(req.params.id)
    .populate('studentId', 'name studentId grade class')
    .populate('requestedBy', 'name email phone')
    .populate('teacherApproval.approvedBy', 'name')
    .populate('adminApproval.approvedBy', 'name');

  if (!dismissal) {
    return next(new ErrorResponse(`Dismissal not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: dismissal
  });
});

// @desc    Create dismissal request
// @route   POST /api/dismissal
// @access  Private/Parent
exports.createDismissal = asyncHandler(async (req, res, next) => {
  const { studentId, dismissalDate, dismissalTime, reason } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${studentId}`, 404));
  }

  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  const dismissal = await Dismissal.create({
    studentId,
    requestedBy: req.user._id,
    dismissalDate,
    dismissalTime,
    reason
  });

  // Notify teacher
  if (student.teacherId) {
    await Notification.create({
      userId: student.teacherId,
      title: 'طلب مغادرة جديد',
      message: `طلب مغادرة جديد للطالب ${student.name}`,
      type: 'dismissal',
      relatedId: dismissal._id,
      relatedModel: 'Dismissal',
      priority: 'high'
    });
  }

  await logAudit({
    action: 'dismissal_create',
    category: 'incident',
    resourceType: 'Dismissal',
    resourceId: dismissal._id.toString(),
    req,
    metadata: { studentId: studentId.toString(), status: dismissal.status },
  });

  res.status(201).json({
    success: true,
    data: dismissal
  });
});

// @desc    Update dismissal
// @route   PUT /api/dismissal/:id
// @access  Private
exports.updateDismissal = asyncHandler(async (req, res, next) => {
  let dismissal = await Dismissal.findById(req.params.id);

  if (!dismissal) {
    return next(new ErrorResponse(`Dismissal not found with id of ${req.params.id}`, 404));
  }

  if (req.user.role === 'parent' && dismissal.requestedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  if (!['pending_teacher', 'pending_admin'].includes(dismissal.status)) {
    return next(new ErrorResponse('Cannot update processed dismissal', 400));
  }

  dismissal = await Dismissal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: dismissal
  });
});

// @desc    Teacher approve dismissal
// @route   PUT /api/dismissal/:id/approve-teacher
// @access  Private/Teacher
exports.approveDismissalTeacher = asyncHandler(async (req, res, next) => {
  const { approved, notes } = req.body;

  let dismissal = await Dismissal.findById(req.params.id);

  if (!dismissal) {
    return next(new ErrorResponse(`Dismissal not found with id of ${req.params.id}`, 404));
  }

  if (dismissal.status !== 'pending_teacher') {
    return next(new ErrorResponse('Dismissal not in pending teacher status', 400));
  }

  const student = await Student.findById(dismissal.studentId);
  if (student.teacherId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to approve this dismissal', 403));
  }

  dismissal.teacherApproval = {
    approved,
    approvedBy: req.user._id,
    approvedAt: new Date(),
    notes
  };

  if (approved) {
    dismissal.status = 'pending_admin';
    // Notify admin
    await Notification.create({
      userId: dismissal.requestedBy,
      title: 'تمت موافقة المعلم',
      message: `تمت موافقة المعلم على طلب المغادرة للطالب ${student.name}`,
      type: 'dismissal',
      relatedId: dismissal._id,
      relatedModel: 'Dismissal',
      priority: 'medium'
    });
  } else {
    dismissal.status = 'rejected';
    await Notification.create({
      userId: dismissal.requestedBy,
      title: 'تم رفض طلب المغادرة',
      message: `تم رفض طلب المغادرة للطالب ${student.name} من قبل المعلم`,
      type: 'dismissal',
      relatedId: dismissal._id,
      relatedModel: 'Dismissal',
      priority: 'high'
    });
  }

  await dismissal.save();

  await logAudit({
    action: approved ? 'dismissal_teacher_approved' : 'dismissal_teacher_rejected',
    category: 'permission_change',
    resourceType: 'Dismissal',
    resourceId: dismissal._id.toString(),
    req,
    metadata: { status: dismissal.status },
  });

  res.status(200).json({
    success: true,
    data: dismissal
  });
});

// @desc    Admin approve dismissal
// @route   PUT /api/dismissal/:id/approve-admin
// @access  Private/Admin
exports.approveDismissalAdmin = asyncHandler(async (req, res, next) => {
  const { approved, notes } = req.body;

  let dismissal = await Dismissal.findById(req.params.id);

  if (!dismissal) {
    return next(new ErrorResponse(`Dismissal not found with id of ${req.params.id}`, 404));
  }

  if (dismissal.status !== 'pending_admin') {
    return next(new ErrorResponse('Dismissal not in pending admin status', 400));
  }

  dismissal.adminApproval = {
    approved,
    approvedBy: req.user._id,
    approvedAt: new Date(),
    notes
  };

  dismissal.status = approved ? 'approved' : 'rejected';

  const student = await Student.findById(dismissal.studentId);
  await Notification.create({
    userId: dismissal.requestedBy,
    title: approved ? 'تمت الموافقة على طلب المغادرة' : 'تم رفض طلب المغادرة',
    message: `طلب المغادرة للطالب ${student.name} ${approved ? 'تمت الموافقة عليه' : 'تم رفضه'}`,
    type: 'dismissal',
    relatedId: dismissal._id,
    relatedModel: 'Dismissal',
    priority: 'high'
  });

  await dismissal.save();

  await logAudit({
    action: approved ? 'dismissal_admin_approved' : 'dismissal_admin_rejected',
    category: 'permission_change',
    resourceType: 'Dismissal',
    resourceId: dismissal._id.toString(),
    req,
    metadata: { status: dismissal.status },
  });

  res.status(200).json({
    success: true,
    data: dismissal
  });
});

// @desc    Complete dismissal
// @route   PUT /api/dismissal/:id/complete
// @access  Private/Staff
exports.completeDismissal = asyncHandler(async (req, res, next) => {
  let dismissal = await Dismissal.findById(req.params.id);

  if (!dismissal) {
    return next(new ErrorResponse(`Dismissal not found with id of ${req.params.id}`, 404));
  }

  if (dismissal.status !== 'approved') {
    return next(new ErrorResponse('Dismissal must be approved before completion', 400));
  }

  dismissal.status = 'completed';
  dismissal.completedAt = new Date();
  dismissal.completedBy = req.user._id;

  await dismissal.save();

  await logAudit({
    action: 'dismissal_completed',
    category: 'incident',
    resourceType: 'Dismissal',
    resourceId: dismissal._id.toString(),
    req,
    metadata: { status: dismissal.status },
  });

  res.status(200).json({
    success: true,
    data: dismissal
  });
});

// @desc    Cancel dismissal
// @route   PUT /api/dismissal/:id/cancel
// @access  Private
exports.cancelDismissal = asyncHandler(async (req, res, next) => {
  let dismissal = await Dismissal.findById(req.params.id);

  if (!dismissal) {
    return next(new ErrorResponse(`Dismissal not found with id of ${req.params.id}`, 404));
  }

  if (req.user.role === 'parent' && dismissal.requestedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  if (['completed', 'cancelled'].includes(dismissal.status)) {
    return next(new ErrorResponse('Cannot cancel completed or already cancelled dismissal', 400));
  }

  dismissal.status = 'cancelled';
  await dismissal.save();

  await logAudit({
    action: 'dismissal_cancelled',
    category: 'incident',
    resourceType: 'Dismissal',
    resourceId: dismissal._id.toString(),
    req,
    metadata: { status: dismissal.status },
  });

  res.status(200).json({
    success: true,
    data: dismissal
  });
});
