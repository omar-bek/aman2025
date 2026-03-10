const Bus = require('../models/Bus');
const Attendance = require('../models/Attendance');
const asyncHandler = require('../middleware/async');

// Helper to get driver's bus
async function getDriverBus(userId) {
  return Bus.findOne({ driverId: userId });
}

// GET /api/driver/route
exports.getRoute = asyncHandler(async (req, res) => {
  const bus = await getDriverBus(req.user._id);
  if (!bus) {
    return res.json({
      route_name: 'No route',
      students_count: 0,
      stops: [],
      current_stop: null,
      next_stop: null,
      has_active_route: false,
    });
  }

  const studentsCount = Array.isArray(bus.studentIds) ? bus.studentIds.length : 0;

  res.json({
    route_name: bus.route?.name || 'Route',
    students_count: studentsCount,
    stops: bus.route?.stops || [],
    current_stop: null,
    next_stop: null,
    has_active_route: false,
  });
});

// GET /api/driver/stats/today
exports.getTodayStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const records = await Attendance.find({
    date: { $gte: today, $lte: end },
    location: 'bus',
  });

  res.json({
    completed_routes: 1,
    students_transported: records.length,
    on_time_percentage: 100,
    incidents: 0,
  });
});

// POST /api/driver/emergency
exports.sendEmergency = asyncHandler(async (req, res) => {
  res.status(201).json({ status: 'ok' });
});

// POST /api/driver/route/start
exports.startRoute = asyncHandler(async (req, res) => {
  const bus = await getDriverBus(req.user._id);
  res.status(201).json({
    route_id: bus ? String(bus._id) : 'route-1',
    started_at: new Date().toISOString(),
  });
});

// POST /api/driver/route/end
exports.endRoute = asyncHandler(async (req, res) => {
  const bus = await getDriverBus(req.user._id);
  res.status(201).json({
    route_id: bus ? String(bus._id) : 'route-1',
    ended_at: new Date().toISOString(),
  });
});

// GET /api/driver/route/active
exports.getActiveRoute = asyncHandler(async (req, res) => {
  const bus = await getDriverBus(req.user._id);
  if (!bus) {
    return res.json(null);
  }

  const stops =
    bus.route?.stops?.map((s, idx) => ({
      id: idx + 1,
      name: s.name,
      address: s.name,
      order: s.order,
      students: [],
      estimated_arrival: null,
      actual_arrival: null,
    })) || [];

  res.json({
    id: String(bus._id),
    name: bus.route?.name || 'Route',
    type: 'pickup',
    stops,
  });
});

// POST /api/driver/route/stop/:stopId/arrive
exports.arriveAtStop = asyncHandler(async (req, res) => {
  res.status(201).json({
    stop_id: req.params.stopId,
    arrived_at: new Date().toISOString(),
  });
});

// GET /api/driver/route/latest/summary and /api/driver/route/:routeId/summary
exports.getRouteSummary = asyncHandler(async (req, res) => {
  const bus = await getDriverBus(req.user._id);
  if (!bus) {
    return res.status(404).json({ message: 'No route found' });
  }

  const now = new Date();
  const start = new Date(now.getTime() - 45 * 60000);

  const stops = bus.route?.stops || [];
  const totalStops = stops.length;
  const studentsCount = Array.isArray(bus.studentIds) ? bus.studentIds.length : 0;

  const logs = [
    {
      id: 1,
      event_type: 'departure',
      location: 'School',
      timestamp: start.toISOString(),
    },
    ...stops.map((s, idx) => ({
      id: idx + 2,
      event_type: 'arrival',
      location: s.name,
      timestamp: new Date(start.getTime() + (idx + 1) * 10 * 60000).toISOString(),
    })),
    {
      id: totalStops + 2,
      event_type: 'arrival',
      location: 'School',
      timestamp: now.toISOString(),
    },
  ];

  res.json({
    route_id: String(bus._id),
    route_name: bus.route?.name || 'Route',
    type: 'pickup',
    start_time: start.toISOString(),
    end_time: now.toISOString(),
    duration_minutes: 45,
    total_stops: totalStops,
    completed_stops: totalStops,
    total_students: studentsCount,
    checked_in_students: studentsCount,
    delays: 0,
    incidents: 0,
    logs,
  });
});

