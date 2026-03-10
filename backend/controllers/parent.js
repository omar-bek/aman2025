const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { Grade } = require('../models/Academic');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/async');

// Helper: get today's date range
function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Helper: derive simple academic band from grades
function getAcademicBand(grades) {
  if (!grades || grades.length === 0) return 'unknown';
  const avg =
    grades.reduce((sum, g) => sum + (typeof g.grade === 'number' ? g.grade : 0), 0) /
    grades.length;

  if (avg >= 85) return 'on_track';
  if (avg >= 70) return 'behind';
  return 'needs_support';
}

// Helper: derive attendance & location state from today's events
function getAttendanceAndLocation(attendanceEvents) {
  if (!attendanceEvents || attendanceEvents.length === 0) {
    return {
      locationState: 'home',
      attendanceState: 'pending',
    };
  }

  // Sort by date just in case
  const sorted = [...attendanceEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const latest = sorted[sorted.length - 1];

  let locationState = 'home';
  switch (latest.type) {
    case 'bus_boarding':
      locationState = 'on_route';
      break;
    case 'school_entry':
      locationState = 'in_class';
      break;
    case 'school_exit':
      locationState = 'leaving';
      break;
    case 'bus_alighting':
    case 'home_arrival':
      locationState = 'home';
      break;
    default:
      locationState = latest.location || 'unknown';
  }

  // Very simple attendance band for today
  const hasSchoolEntry = attendanceEvents.some((e) => e.type === 'school_entry');
  const now = new Date();
  let attendanceState = 'pending';

  if (hasSchoolEntry) {
    attendanceState = 'present';
  } else {
    const schoolStart = new Date(now);
    schoolStart.setHours(8, 0, 0, 0);
    if (now > schoolStart) {
      attendanceState = 'late';
    }
  }

  return { locationState, attendanceState };
}

// Helper: derive readiness score & confidence index
function getReadinessAndConfidence({ attendanceEvents, grades }) {
  let score = 80;

  if (!attendanceEvents || attendanceEvents.length === 0) {
    score -= 10;
  } else if (!attendanceEvents.some((e) => e.type === 'school_entry')) {
    score -= 5;
  }

  const band = getAcademicBand(grades);
  if (band === 'needs_support') score -= 15;
  else if (band === 'behind') score -= 5;

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  const hasSensor =
    attendanceEvents &&
    attendanceEvents.some((e) => e.method === 'rfid' || e.method === 'smartwatch');

  const confidenceIndex = hasSensor ? 'high' : attendanceEvents?.length ? 'medium' : 'low';

  return { readinessScore: score, confidenceIndex };
}

// @desc    Parent Daily Assurance Dashboard
// @route   GET /api/parent/dashboard
// @access  Private/Parent
exports.getParentDashboard = asyncHandler(async (req, res) => {
  const user = req.user;

  // Only parents should access this endpoint
  if (user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      message: 'Only parents can access this dashboard',
    });
  }

  const { start, end } = getTodayRange();

  // Load children for this parent (RBAC by relation, not query param)
  const students = await Student.find({
    _id: { $in: user.studentIds || [] },
    isActive: true,
  }).select('name grade class busId');

  const studentIds = students.map((s) => s._id);

  // Fetch today's attendance and recent grades in parallel
  const [attendanceEvents, grades, notifications] = await Promise.all([
    Attendance.find({
      studentId: { $in: studentIds },
      date: { $gte: start, $lte: end },
    }),
    Grade.find({
      studentId: { $in: studentIds },
    }).sort('-date').limit(100),
    Notification.find({
      userId: user._id,
    })
      .sort('-createdAt')
      .limit(20),
  ]);

  const attendanceByStudent = new Map();
  attendanceEvents.forEach((event) => {
    const key = String(event.studentId);
    if (!attendanceByStudent.has(key)) attendanceByStudent.set(key, []);
    attendanceByStudent.get(key).push(event);
  });

  const gradesByStudent = new Map();
  grades.forEach((g) => {
    const key = String(g.studentId);
    if (!gradesByStudent.has(key)) gradesByStudent.set(key, []);
    gradesByStudent.get(key).push(g);
  });

  const children = students.map((student) => {
    const sid = String(student._id);
    const studentAttendance = attendanceByStudent.get(sid) || [];
    const studentGrades = gradesByStudent.get(sid) || [];

    const { locationState, attendanceState } = getAttendanceAndLocation(studentAttendance);
    const academicBand = getAcademicBand(studentGrades);
    const wellbeingState = 'stable'; // placeholder until wellbeing model exists
    const { readinessScore, confidenceIndex } = getReadinessAndConfidence({
      attendanceEvents: studentAttendance,
      grades: studentGrades,
    });

    return {
      id: sid,
      name: student.name,
      grade: student.grade,
      class: student.class,
      locationState,
      attendanceState,
      wellbeingState,
      academicState: academicBand,
      readinessScore,
      confidenceIndex,
    };
  });

  const overallStatus =
    children.some((c) => c.attendanceState === 'late') ||
    children.some((c) => c.wellbeingState === 'attention')
      ? 'action-required'
      : children.some((c) => c.attendanceState === 'pending')
      ? 'informational'
      : 'safe';

  const response = {
    date: new Date().toISOString(),
    overallStatus,
    children,
    notificationsSummary: {
      unreadCount: notifications.filter((n) => !n.isRead).length,
      latest: notifications.slice(0, 5).map((n) => ({
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        createdAt: n.createdAt,
      })),
    },
  };

  res.status(200).json({
    success: true,
    data: response,
  });
});

