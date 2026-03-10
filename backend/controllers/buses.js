const Bus = require('../models/Bus');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all buses
// @route   GET /api/buses
// @access  Private
exports.getBuses = asyncHandler(async (req, res, next) => {
  const buses = await Bus.find()
    .populate('driverId', 'name email phone')
    .populate('studentIds', 'name studentId grade');

  res.status(200).json({
    success: true,
    count: buses.length,
    data: buses
  });
});

// @desc    Get single bus
// @route   GET /api/buses/:id
// @access  Private
exports.getBus = asyncHandler(async (req, res, next) => {
  const bus = await Bus.findById(req.params.id)
    .populate('driverId', 'name email phone')
    .populate('studentIds', 'name studentId grade class');

  if (!bus) {
    return next(new ErrorResponse(`Bus not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: bus
  });
});

// @desc    Create new bus
// @route   POST /api/buses
// @access  Private/Admin
exports.createBus = asyncHandler(async (req, res, next) => {
  const bus = await Bus.create(req.body);

  res.status(201).json({
    success: true,
    data: bus
  });
});

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
exports.updateBus = asyncHandler(async (req, res, next) => {
  let bus = await Bus.findById(req.params.id);

  if (!bus) {
    return next(new ErrorResponse(`Bus not found with id of ${req.params.id}`, 404));
  }

  bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: bus
  });
});

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
exports.deleteBus = asyncHandler(async (req, res, next) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    return next(new ErrorResponse(`Bus not found with id of ${req.params.id}`, 404));
  }

  await bus.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update bus location
// @route   PUT /api/buses/:id/location
// @access  Private/Driver
exports.updateBusLocation = asyncHandler(async (req, res, next) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return next(new ErrorResponse('Please provide latitude and longitude', 400));
  }

  let bus = await Bus.findById(req.params.id);

  if (!bus) {
    return next(new ErrorResponse(`Bus not found with id of ${req.params.id}`, 404));
  }

  // Check if driver owns this bus
  if (req.user.role === 'driver' && bus.driverId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this bus location', 403));
  }

  bus.currentLocation = {
    lat,
    lng,
    timestamp: new Date()
  };

  await bus.save();

  // Emit real-time update via Socket.io
  const io = req.app.get('io');
  if (io) {
    io.emit('busLocationUpdate', {
      busId: bus._id,
      location: bus.currentLocation
    });
  }

  res.status(200).json({
    success: true,
    data: bus
  });
});

// @desc    Get bus students
// @route   GET /api/buses/:id/students
// @access  Private
exports.getBusStudents = asyncHandler(async (req, res, next) => {
  const bus = await Bus.findById(req.params.id).populate('studentIds');

  if (!bus) {
    return next(new ErrorResponse(`Bus not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    count: bus.studentIds.length,
    data: bus.studentIds
  });
});
