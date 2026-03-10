const Pickup = require('../models/Pickup');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { logAudit } = require('../services/auditService');

// @desc    Get all pickups
// @route   GET /api/pickup
// @access  Private
exports.getPickups = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'parent') {
    query.requestedBy = req.user._id;
  }

  const { studentId, status, pickupDate, page = 1, limit = 50 } = req.query;
  if (studentId) query.studentId = studentId;
  if (status) query.status = status;
  if (pickupDate) query.pickupDate = new Date(pickupDate);

  const pageInt = parseInt(page, 10) || 1;
  const limitInt = Math.min(parseInt(limit, 10) || 50, 200);
  const skip = (pageInt - 1) * limitInt;

  const [pickups, total] = await Promise.all([
    Pickup.find(query)
      .populate('studentId', 'name studentId grade class')
      .populate('requestedBy', 'name email phone')
      .populate('approvedBy', 'name')
      .populate('verifiedBy', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitInt),
    Pickup.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: pickups.length,
    total,
    page: pageInt,
    limit: limitInt,
    data: pickups,
  });
});

// @desc    Get single pickup
// @route   GET /api/pickup/:id
// @access  Private
exports.getPickup = asyncHandler(async (req, res, next) => {
  const pickup = await Pickup.findById(req.params.id)
    .populate('studentId', 'name studentId grade class')
    .populate('requestedBy', 'name email phone')
    .populate('approvedBy', 'name')
    .populate('verifiedBy', 'name');

  if (!pickup) {
    return next(new ErrorResponse(`Pickup not found with id of ${req.params.id}`, 404));
  }

  // Check access
  if (req.user.role === 'parent' && pickup.requestedBy._id.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  res.status(200).json({
    success: true,
    data: pickup
  });
});

// @desc    Create pickup request
// @route   POST /api/pickup
// @access  Private/Parent
exports.createPickup = asyncHandler(async (req, res, next) => {
  const { studentId, pickupDate, pickupTime, authorizedPerson } = req.body;

  // Verify student
  const student = await Student.findById(studentId);
  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${studentId}`, 404));
  }

  // Check if parent owns this student
  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized to request pickup for this student', 403));
  }

  const pickup = await Pickup.create({
    studentId,
    requestedBy: req.user._id,
    pickupDate,
    pickupTime,
    authorizedPerson
  });

  // Generate QR Code (contains only ids and timestamp, verification is server-side)
  const qrData = JSON.stringify({
    pickupId: pickup._id,
    studentId: studentId,
    timestamp: pickup.createdAt
  });

  const qrCode = await QRCode.toDataURL(qrData);
  pickup.qrCode = qrCode;
  await pickup.save();

  // Create notification for admin/staff
  await Notification.create({
    userId: req.user._id,
    title: 'طلب استلام جديد',
    message: `طلب استلام جديد للطالب ${student.name}`,
    type: 'pickup',
    relatedId: pickup._id,
    relatedModel: 'Pickup',
    priority: 'high'
  });

  await logAudit({
    action: 'pickup_create',
    category: 'incident',
    resourceType: 'Pickup',
    resourceId: pickup._id.toString(),
    req,
    metadata: { studentId: studentId.toString(), status: pickup.status },
  });

  res.status(201).json({
    success: true,
    data: pickup
  });
});

// @desc    Update pickup
// @route   PUT /api/pickup/:id
// @access  Private
exports.updatePickup = asyncHandler(async (req, res, next) => {
  let pickup = await Pickup.findById(req.params.id);

  if (!pickup) {
    return next(new ErrorResponse(`Pickup not found with id of ${req.params.id}`, 404));
  }

  // Check access
  if (req.user.role === 'parent' && pickup.requestedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Only allow update if pending
  if (pickup.status !== 'pending') {
    return next(new ErrorResponse('Cannot update approved/rejected pickup', 400));
  }

  pickup = await Pickup.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: pickup
  });
});

// @desc    Approve pickup
// @route   PUT /api/pickup/:id/approve
// @access  Private/Admin
exports.approvePickup = asyncHandler(async (req, res, next) => {
  const { approved } = req.body; // true or false

  let pickup = await Pickup.findById(req.params.id);

  if (!pickup) {
    return next(new ErrorResponse(`Pickup not found with id of ${req.params.id}`, 404));
  }

  if (pickup.status !== 'pending') {
    return next(new ErrorResponse('Pickup already processed', 400));
  }

  pickup.status = approved ? 'approved' : 'rejected';
  pickup.approvedBy = req.user._id;
  pickup.approvedAt = new Date();

  await pickup.save();

  // Notify parent
  await Notification.create({
    userId: pickup.requestedBy,
    title: approved ? 'تم الموافقة على طلب الاستلام' : 'تم رفض طلب الاستلام',
    message: `طلب الاستلام للطالب ${pickup.studentId} ${approved ? 'تمت الموافقة عليه' : 'تم رفضه'}`,
    type: 'pickup',
    relatedId: pickup._id,
    relatedModel: 'Pickup',
    priority: 'high'
  });

  await logAudit({
    action: approved ? 'pickup_approved' : 'pickup_rejected',
    category: 'permission_change',
    resourceType: 'Pickup',
    resourceId: pickup._id.toString(),
    req,
    metadata: { status: pickup.status },
  });

  res.status(200).json({
    success: true,
    data: pickup
  });
});

// @desc    Verify pickup
// @route   PUT /api/pickup/:id/verify
// @access  Private/Staff
exports.verifyPickup = asyncHandler(async (req, res, next) => {
  const { verificationMethod } = req.body;

  let pickup = await Pickup.findById(req.params.id);

  if (!pickup) {
    return next(new ErrorResponse(`Pickup not found with id of ${req.params.id}`, 404));
  }

  if (pickup.status !== 'approved') {
    return next(new ErrorResponse('Pickup must be approved before verification', 400));
  }

  pickup.status = 'completed';
  pickup.verificationMethod = verificationMethod || 'manual';
  pickup.verifiedBy = req.user._id;
  pickup.verifiedAt = new Date();

  await pickup.save();

  await logAudit({
    action: 'pickup_verified',
    category: 'data_access',
    resourceType: 'Pickup',
    resourceId: pickup._id.toString(),
    req,
    metadata: { verificationMethod: pickup.verificationMethod },
  });

  res.status(200).json({
    success: true,
    data: pickup
  });
});

// @desc    Cancel pickup
// @route   PUT /api/pickup/:id/cancel
// @access  Private
exports.cancelPickup = asyncHandler(async (req, res, next) => {
  let pickup = await Pickup.findById(req.params.id);

  if (!pickup) {
    return next(new ErrorResponse(`Pickup not found with id of ${req.params.id}`, 404));
  }

  // Check access
  if (req.user.role === 'parent' && pickup.requestedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  if (['completed', 'cancelled'].includes(pickup.status)) {
    return next(new ErrorResponse('Cannot cancel completed or already cancelled pickup', 400));
  }

  pickup.status = 'cancelled';
  await pickup.save();

  await logAudit({
    action: 'pickup_cancelled',
    category: 'incident',
    resourceType: 'Pickup',
    resourceId: pickup._id.toString(),
    req,
    metadata: { status: pickup.status },
  });

  res.status(200).json({
    success: true,
    data: pickup
  });
});
