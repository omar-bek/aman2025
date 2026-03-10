const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Helper: clamp value between min and max
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Helper: derive emirate code from student's address.city (simple mapping for demo)
const mapCityToEmirateCode = (city) => {
  if (!city) return 'OTH';
  const normalized = String(city).toLowerCase();
  if (normalized.includes('dubai')) return 'DXB';
  if (normalized.includes('abu') || normalized.includes('abudhabi') || normalized.includes('abu dhabi')) return 'AUH';
  if (normalized.includes('sharjah')) return 'SHJ';
  if (normalized.includes('ajman')) return 'AJM';
  if (normalized.includes('ras al khaimah') || normalized.includes('rak')) return 'RAK';
  if (normalized.includes('fujairah')) return 'FJR';
  if (normalized.includes('umm al quwain') || normalized.includes('uaq')) return 'UAQ';
  return 'OTH';
};

// Helper: group attendance into simple daily presence counts by emirate
const aggregateAttendance = (records, studentsById, startDate, endDate) => {
  const counts = new Map();

  records.forEach((r) => {
    const student = studentsById.get(String(r.studentId));
    const emirateCode = student ? mapCityToEmirateCode(student.address && student.address.city) : 'OTH';
    const schoolType = 'public'; // Simplified bucket; can be extended when school type exists

    const dayKey = new Date(r.date);
    dayKey.setHours(0, 0, 0, 0);
    const key = `${dayKey.toISOString()}|${emirateCode}|${schoolType}`;

    if (!counts.has(key)) {
      counts.set(key, {
        date: dayKey.toISOString(),
        emirateCode,
        schoolType,
        nStudents: 0,
      });
    }
    const entry = counts.get(key);
    entry.nStudents += 1;
  });

  return Array.from(counts.values());
};

// @desc    Get anonymized, aggregated attendance trends for government dashboard
// @route   GET /api/government/attendance-trends
// @access  Private (super_admin, government_admin, authority_admin)
exports.getAttendanceTrends = asyncHandler(async (req, res, next) => {
  const {
    timeframe = 'current_term',
    start_date,
    end_date,
    emirate_code,
    region_code,
    school_type,
    min_cell_size,
  } = req.query;

  const minCellSize = parseInt(min_cell_size, 10) || 10;

  // Derive date range based on timeframe if explicit dates are not provided
  const now = new Date();
  let start = start_date ? new Date(start_date) : null;
  let end = end_date ? new Date(end_date) : null;

  if (!start || !end) {
    end = new Date(now);
    end.setHours(23, 59, 59, 999);

    start = new Date(now);
    start.setHours(0, 0, 0, 0);

    if (timeframe === 'last_30_days') {
      start.setDate(start.getDate() - 29);
    } else if (timeframe === 'current_year') {
      start = new Date(now.getFullYear(), 0, 1);
    } else {
      // current_term (simplified: last 90 days)
      start.setDate(start.getDate() - 89);
    }
  }

  if (start > end) {
    return next(new ErrorResponse('Invalid date range', 400));
  }

  // Fetch attendance records within range (no per-student exposure in response)
  const attendanceQuery = {
    date: {
      $gte: start,
      $lte: end,
    },
  };

  const attendanceRecords = await Attendance.find(attendanceQuery).select('studentId date');

  // Fetch students for mapping to emirate (no names or direct identifiers returned later)
  const studentIds = Array.from(new Set(attendanceRecords.map((r) => String(r.studentId))));
  const students = await Student.find({ _id: { $in: studentIds } }).select('address.city');
  const studentsById = new Map(students.map((s) => [String(s._id), s]));

  // Aggregate counts per day/emirate/schoolType
  const aggregated = aggregateAttendance(attendanceRecords, studentsById, start, end);

  // Filter by emirate or school type if provided
  const filtered = aggregated.filter((p) => {
    if (emirate_code && p.emirateCode !== emirate_code) return false;
    if (school_type && school_type !== 'all' && p.schoolType !== school_type) return false;
    // region_code is currently not mapped; ignore for now but keep parameter for future extension
    return true;
  });

  // Derive a rough attendance rate from counts
  // NOTE: Without full enrollment, we simulate a rate for demo purposes, bounded between 85% and 99%.
  const points = filtered.map((p) => {
    const syntheticRate = clamp(85 + Math.log10(1 + p.nStudents) * 5, 85, 99);
    const shouldSuppress = p.nStudents < minCellSize;
    return {
      date: p.date,
      emirateCode: p.emirateCode,
      regionCode: region_code || undefined,
      schoolType: p.schoolType,
      attendanceRate: shouldSuppress ? null : syntheticRate,
      nSchools: 1, // placeholder, we do not expose or track individual schools here
      nStudents: p.nStudents,
      isSuppressed: shouldSuppress,
    };
  });

  // Compute simple national summary
  const visiblePoints = points.filter((p) => p.attendanceRate != null);
  const nationalAverageRate =
    visiblePoints.length > 0
      ? visiblePoints.reduce((sum, p) => sum + p.attendanceRate, 0) / visiblePoints.length
      : null;

  // For demo: assume previous period change is modest
  const nationalChangeVsPrevious = nationalAverageRate != null ? (Math.random() - 0.5) * 2 : null;

  // Top emirates by average rate
  const byEmirate = new Map();
  visiblePoints.forEach((p) => {
    if (!byEmirate.has(p.emirateCode)) {
      byEmirate.set(p.emirateCode, { sum: 0, count: 0 });
    }
    const entry = byEmirate.get(p.emirateCode);
    entry.sum += p.attendanceRate;
    entry.count += 1;
  });

  const topEmirates = Array.from(byEmirate.entries())
    .map(([emirateCode, { sum, count }]) => ({
      emirateCode,
      averageAttendanceRate: sum / count,
    }))
    .sort((a, b) => (b.averageAttendanceRate || 0) - (a.averageAttendanceRate || 0))
    .slice(0, 3);

  const policyThreshold = 90;

  // Attention regions: any emirate whose average is below threshold
  const attentionRegions = Array.from(byEmirate.entries())
    .map(([emirateCode, { sum, count }]) => {
      const avg = sum / count;
      const diff = nationalAverageRate != null ? avg - nationalAverageRate : 0;
      let trendDirection = 'stable';
      if (diff > 1) trendDirection = 'improving';
      if (diff < -1) trendDirection = 'deteriorating';

      let riskLevel = 'low';
      if (avg < policyThreshold - 5) riskLevel = 'high';
      else if (avg < policyThreshold) riskLevel = 'medium';

      return {
        emirateCode,
        regionCode: undefined,
        schoolType: undefined,
        averageAttendanceRate: avg,
        trendDirection,
        riskLevel,
      };
    })
    .filter((r) => r.averageAttendanceRate < policyThreshold);

  res.status(200).json({
    points,
    summary: {
      timeframe: timeframe,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      nationalAverageRate,
      nationalChangeVsPrevious,
      topEmirates,
      attentionRegions,
      policyThreshold,
    },
  });
});

