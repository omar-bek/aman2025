const Behavior = require('../models/Behavior');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all behaviors
// @route   GET /api/behavior
// @access  Private
exports.getBehaviors = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'parent') {
    const students = await Student.find({ parentIds: req.user._id });
    const studentIds = students.map(s => s._id);
    query.studentId = { $in: studentIds };
  }

  const { studentId, type, category, severity } = req.query;
  if (studentId) query.studentId = studentId;
  if (type) query.type = type;
  if (category) query.category = category;
  if (severity) query.severity = severity;

  const behaviors = await Behavior.find(query)
    .populate('studentId', 'name studentId grade class')
    .populate('reportedBy', 'name')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: behaviors.length,
    data: behaviors
  });
});

// @desc    Get single behavior
// @route   GET /api/behavior/:id
// @access  Private
exports.getBehavior = asyncHandler(async (req, res, next) => {
  const behavior = await Behavior.findById(req.params.id)
    .populate('studentId', 'name studentId grade class')
    .populate('reportedBy', 'name');

  if (!behavior) {
    return next(new ErrorResponse(`Behavior not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: behavior
  });
});

// @desc    Create behavior record
// @route   POST /api/behavior
// @access  Private/Staff
exports.createBehavior = asyncHandler(async (req, res, next) => {
  const behavior = await Behavior.create({
    ...req.body,
    reportedBy: req.user._id
  });

  // Notify parents if negative behavior
  if (behavior.type === 'negative' && behavior.severity !== 'low') {
    const student = await Student.findById(behavior.studentId);
    if (student && student.parentIds.length > 0) {
      for (const parentId of student.parentIds) {
        await Notification.create({
          userId: parentId,
          title: 'تنبيه سلوكي',
          message: `تم تسجيل ملاحظة سلوكية للطالب ${student.name}`,
          type: 'behavior',
          relatedId: behavior._id,
          relatedModel: 'Behavior',
          priority: behavior.severity === 'high' ? 'urgent' : 'high'
        });
      }
    }
  }

  res.status(201).json({
    success: true,
    data: behavior
  });
});

// @desc    Update behavior
// @route   PUT /api/behavior/:id
// @access  Private/Staff
exports.updateBehavior = asyncHandler(async (req, res, next) => {
  let behavior = await Behavior.findById(req.params.id);

  if (!behavior) {
    return next(new ErrorResponse(`Behavior not found with id of ${req.params.id}`, 404));
  }

  behavior = await Behavior.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: behavior
  });
});

// @desc    Delete behavior
// @route   DELETE /api/behavior/:id
// @access  Private/Admin
exports.deleteBehavior = asyncHandler(async (req, res, next) => {
  const behavior = await Behavior.findById(req.params.id);

  if (!behavior) {
    return next(new ErrorResponse(`Behavior not found with id of ${req.params.id}`, 404));
  }

  await behavior.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
