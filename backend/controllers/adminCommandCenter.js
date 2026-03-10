const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Pickup = require('../models/Pickup');
const Dismissal = require('../models/Dismissal');
const Concern = require('../models/Concern');
const asyncHandler = require('../middleware/async');

// GET /api/admin/command-center/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const [attendanceToday, pendingPickups, pendingDismissals, students] = await Promise.all([
    Attendance.find({ date: { $gte: today, $lte: end } }),
    Pickup.find({ status: 'pending' }),
    Dismissal.find({ status: { $in: ['pending_teacher', 'pending_admin'] } }),
    Student.find({}),
  ]);

  const totalStudents = students.length;
  const studentsOnCampus = attendanceToday.filter((a) => a.type === 'school_entry').length;

  const activeConcerns = await Concern.countDocuments({
    status: { $in: ['new', 'in_progress'] },
  });

  const kpis = {
    activeIncidents: activeConcerns,
    activeIncidentsTrend: 'neutral',
    pendingApprovals: pendingPickups.length + pendingDismissals.length,
    pendingApprovalsTrend: 'neutral',
    slaCompliance: 95,
    slaComplianceTrend: 'up',
    resolvedToday: 0,
    resolvedTodayTrend: 'neutral',
    avgResponseTime: '15m',
    avgResponseTimeTrend: 'neutral',
    studentsOnCampus,
    studentsOnCampusTrend: 'neutral',
  };

  const slaCountdowns = pendingPickups.slice(0, 3).map((p) => ({
    id: String(p._id),
    title: 'طلب استلام',
    priority: 'high',
    timeRemaining: 60,
    assignedTo: 'Admin',
    status: 'pending',
  }));

  const byGrade = new Map();
  students.forEach((s) => {
    const key = s.grade || 'غير محدد';
    if (!byGrade.has(key)) {
      byGrade.set(key, { grade: key, students: 0, incidents: 0, approvals: 0 });
    }
    byGrade.get(key).students += 1;
  });

  const gradeBreakdown = Array.from(byGrade.values());

  res.json({
    kpis,
    slaCountdowns,
    gradeBreakdown,
  });
});

// GET /api/admin/command-center/incidents
exports.getIncidents = asyncHandler(async (req, res) => {
  const concerns = await Concern.find({})
    .populate('studentId', 'name grade class')
    .populate('parentId', 'name')
    .sort('-createdAt')
    .limit(50);

  const incidents = concerns.map((c) => ({
    id: c._id,
    title: c.title,
    titleEn: c.type,
    description: c.description,
    severity: c.priority === 'high' ? 'high' : c.priority === 'medium' ? 'medium' : 'low',
    status: c.status === 'resolved' ? 'resolved' : 'open',
    reportedBy: c.parentId?.name || 'Parent',
    reportedAt: c.createdAt,
    assignedTo: null,
    grade: c.studentId?.grade || '',
    class: c.studentId?.class || '',
    canEdit: true,
    isClosed: c.status === 'resolved',
    auditTrail: [
      {
        action: 'تم الإنشاء',
        user: c.parentId?.name || 'Parent',
        timestamp: c.createdAt,
      },
    ],
  }));

  res.json(incidents);
});

