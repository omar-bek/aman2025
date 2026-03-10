const Attendance = require('../models/Attendance');
const { Assignment, Grade } = require('../models/Academic');
const asyncHandler = require('../middleware/async');

// @desc    Get "My Day" view (schedule-like summary)
// @route   GET /api/student/my-day
// @access  Private/Student
exports.getMyDay = asyncHandler(async (req, res) => {
  const user = req.user;

  // For now we infer studentId from user.studentIds[0]
  const studentId = user.studentIds && user.studentIds[0];

  if (!studentId) {
    return res.status(200).json({
      success: true,
      data: {
        schedule: [],
        homework: [],
        summary: { completedTasks: 0, inProgress: 0 },
      },
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const [assignments] = await Promise.all([
    Assignment.find({
      studentIds: studentId,
      dueDate: { $gte: today },
    }).sort('dueDate'),
  ]);

  const homework = assignments.map((a) => ({
    id: a._id,
    assignment_name: a.title,
    subject: a.subject,
    due_date: a.dueDate,
    status: 'pending',
  }));

  const schedule = [];

  const summary = {
    completed_tasks: 0,
    in_progress: homework.length,
    achievements: [],
  };

  res.status(200).json({
    success: true,
    data: {
      schedule,
      homework,
      summary,
    },
  });
});

// @desc    Get student progress summary
// @route   GET /api/student/progress
// @access  Private/Student
exports.getProgressSummary = asyncHandler(async (req, res) => {
  const user = req.user;
  const studentId = user.studentIds && user.studentIds[0];

  if (!studentId) {
    return res.status(200).json({
      success: true,
      data: { overall_completion: 0, trends: [], subjects: [], milestones: [] },
    });
  }

  const grades = await Grade.find({ studentId });

  if (!grades.length) {
    return res.status(200).json({
      success: true,
      data: { overall_completion: 0, trends: [], subjects: [], milestones: [] },
    });
  }

  const bySubject = new Map();
  grades.forEach((g) => {
    const key = g.subject || 'Other';
    if (!bySubject.has(key)) bySubject.set(key, []);
    bySubject.get(key).push(g);
  });

  const subjects = [];
  bySubject.forEach((subjectGrades, subject) => {
    const avg =
      subjectGrades.reduce((sum, g) => sum + (typeof g.grade === 'number' ? g.grade : 0), 0) /
      subjectGrades.length;

    subjects.push({
      subject,
      completion_rate: Math.round(avg),
      assignments_completed: subjectGrades.length,
      assignments_total: subjectGrades.length,
      recent_improvement: 0,
    });
  });

  const overallAvg =
    subjects.reduce((sum, s) => sum + s.completion_rate, 0) / subjects.length || 0;

  const trends = subjects.map((s) => ({
    subject: s.subject,
    trend: 'stable',
    improvement: 0,
    recent_avg: s.completion_rate,
  }));

  const milestones = [
    {
      title: 'أكملت أول مجموعة درجات',
      icon: '🎓',
      achieved: true,
      date: new Date().toISOString().slice(0, 10),
    },
  ];

  res.status(200).json({
    success: true,
    data: {
      overall_completion: Math.round(overallAvg),
      trends,
      subjects,
      milestones,
    },
  });
});

// @desc    Get today events (simple attendance-based timeline)
// @route   GET /api/student/events/today
// @access  Private/Student
exports.getTodayEvents = asyncHandler(async (req, res) => {
  const user = req.user;
  const studentId = user.studentIds && user.studentIds[0];

  if (!studentId) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const events = await Attendance.find({
    studentId,
    date: { $gte: start, $lte: end },
  }).sort('date');

  const mapped = events.map((e) => ({
    time: e.date,
    type: e.type,
    location: e.location,
  }));

  res.status(200).json({
    success: true,
    data: mapped,
  });
});

