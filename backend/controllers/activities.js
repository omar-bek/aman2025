const Activity = require('../models/Activity');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
exports.getActivities = asyncHandler(async (req, res, next) => {
  let query = {};

  const { type, status, date } = req.query;
  if (type) query.type = type;
  if (status) query.status = status;
  if (date) query.date = new Date(date);

  const activities = await Activity.find(query)
    .populate('organizerId', 'name email')
    .populate('studentIds', 'name studentId grade')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities
  });
});

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
exports.getActivity = asyncHandler(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id)
    .populate('organizerId', 'name email')
    .populate('studentIds', 'name studentId grade class');

  if (!activity) {
    return next(new ErrorResponse(`Activity not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: activity
  });
});

// @desc    Create activity
// @route   POST /api/activities
// @access  Private/Staff
exports.createActivity = asyncHandler(async (req, res, next) => {
  const activity = await Activity.create({
    ...req.body,
    organizerId: req.user._id
  });

  res.status(201).json({
    success: true,
    data: activity
  });
});

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private/Staff
exports.updateActivity = asyncHandler(async (req, res, next) => {
  let activity = await Activity.findById(req.params.id);

  if (!activity) {
    return next(new ErrorResponse(`Activity not found with id of ${req.params.id}`, 404));
  }

  activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: activity
  });
});

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private/Admin
exports.deleteActivity = asyncHandler(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    return next(new ErrorResponse(`Activity not found with id of ${req.params.id}`, 404));
  }

  await activity.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Register student for activity
// @route   POST /api/activities/:id/register
// @access  Private/Parent
exports.registerStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.body;

  const activity = await Activity.findById(req.params.id);
  if (!activity) {
    return next(new ErrorResponse(`Activity not found with id of ${req.params.id}`, 404));
  }

  const student = await Student.findById(studentId);
  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${studentId}`, 404));
  }

  // Check if parent owns this student
  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Check capacity
  if (activity.maxParticipants && activity.studentIds.length >= activity.maxParticipants) {
    return next(new ErrorResponse('Activity is full', 400));
  }

  // Check if already registered
  if (activity.studentIds.includes(studentId)) {
    return next(new ErrorResponse('Student already registered', 400));
  }

  activity.studentIds.push(studentId);
  await activity.save();

  res.status(200).json({
    success: true,
    data: activity
  });
});
