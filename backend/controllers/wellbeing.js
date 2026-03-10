const WellbeingCheckin = require('../models/WellbeingCheckin');
const asyncHandler = require('../middleware/async');

// @desc    Create wellbeing check-in
// @route   POST /api/student/wellbeing/checkin
// @access  Private/Student
exports.createCheckin = asyncHandler(async (req, res) => {
  const user = req.user;
  const studentId = user.studentIds && user.studentIds[0];

  if (!studentId) {
    return res.status(400).json({
      success: false,
      message: 'Student profile not linked',
    });
  }

  const { mood } = req.body;

  const checkin = await WellbeingCheckin.create({
    studentId,
    mood,
  });

  res.status(201).json({
    success: true,
    data: checkin,
  });
});

