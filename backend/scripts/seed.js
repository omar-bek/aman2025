const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../models/User');
const Student = require('../models/Student');
const Bus = require('../models/Bus');
const Attendance = require('../models/Attendance');
const Pickup = require('../models/Pickup');
const Dismissal = require('../models/Dismissal');
const { Grade, Exam, Assignment } = require('../models/Academic');
const Behavior = require('../models/Behavior');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amantac';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
    console.log('🧹 Clearing existing data...');

    await Promise.all([
      Notification.deleteMany({}),
      Activity.deleteMany({}),
      Behavior.deleteMany({}),
      Grade.deleteMany({}),
      Exam.deleteMany({}),
      Assignment.deleteMany({}),
      Pickup.deleteMany({}),
      Dismissal.deleteMany({}),
      Attendance.deleteMany({}),
      Student.deleteMany({}),
      Bus.deleteMany({}),
      User.deleteMany({}),
    ]);

    console.log('✅ Existing data cleared');

    console.log('👤 Creating users...');
    const [admin, teacher, parent1, parent2, staff, driver] = await User.create([
      {
        name: 'Admin User',
        email: 'admin@amantac.com',
        phone: '1000000000',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Teacher One',
        email: 'teacher1@amantac.com',
        phone: '2000000000',
        password: 'teacher123',
        role: 'teacher',
      },
      {
        name: 'Parent One',
        email: 'parent1@amantac.com',
        phone: '3000000000',
        password: 'parent123',
        role: 'parent',
      },
      {
        name: 'Parent Two',
        email: 'parent2@amantac.com',
        phone: '4000000000',
        password: 'parent123',
        role: 'parent',
      },
      {
        name: 'Staff Member',
        email: 'staff@amantac.com',
        phone: '5000000000',
        password: 'staff123',
        role: 'staff',
      },
      {
        name: 'Bus Driver',
        email: 'driver@amantac.com',
        phone: '6000000000',
        password: 'driver123',
        role: 'driver',
      },
    ]);

    console.log('🚌 Creating buses...');
    const [bus1, bus2] = await Bus.create([
      {
        busNumber: 'B-001',
        driverId: driver._id,
        capacity: 40,
        gpsDeviceId: 'GPS-001',
        route: {
          name: 'Route 1',
          stops: [
            {
              name: 'Main Gate',
              coordinates: { lat: 25.2048, lng: 55.2708 },
              order: 1,
            },
            {
              name: 'City Center',
              coordinates: { lat: 25.2100, lng: 55.2800 },
              order: 2,
            },
          ],
        },
      },
      {
        busNumber: 'B-002',
        driverId: driver._id,
        capacity: 30,
        gpsDeviceId: 'GPS-002',
        route: {
          name: 'Route 2',
          stops: [
            {
              name: 'North Gate',
              coordinates: { lat: 25.2200, lng: 55.2900 },
              order: 1,
            },
          ],
        },
      },
    ]);

    console.log('🎓 Creating students...');
    const [student1, student2, student3] = await Student.create([
      {
        studentId: 'STU-001',
        name: 'Student One',
        arabicName: 'الطالب الأول',
        dateOfBirth: new Date(2015, 5, 10),
        grade: '3',
        class: '3A',
        parentIds: [parent1._id],
        teacherId: teacher._id,
        busId: bus1._id,
        rfidTag: 'RFID-001',
        smartwatchId: 'SW-001',
        address: {
          street: 'Main Street',
          city: 'Dubai',
          building: 'Building 1',
          apartment: '101',
          coordinates: { lat: 25.2048, lng: 55.2708 },
        },
        emergencyContacts: [
          {
            name: 'Emergency Contact 1',
            relationship: 'Uncle',
            phone: '7000000000',
          },
        ],
      },
      {
        studentId: 'STU-002',
        name: 'Student Two',
        arabicName: 'الطالب الثاني',
        dateOfBirth: new Date(2014, 8, 20),
        grade: '4',
        class: '4B',
        parentIds: [parent1._id, parent2._id],
        teacherId: teacher._id,
        busId: bus1._id,
        rfidTag: 'RFID-002',
        smartwatchId: 'SW-002',
        address: {
          street: 'Second Street',
          city: 'Dubai',
          building: 'Building 2',
          apartment: '202',
          coordinates: { lat: 25.2100, lng: 55.2800 },
        },
        emergencyContacts: [
          {
            name: 'Emergency Contact 2',
            relationship: 'Aunt',
            phone: '8000000000',
          },
        ],
      },
      {
        studentId: 'STU-003',
        name: 'Student Three',
        arabicName: 'الطالب الثالث',
        dateOfBirth: new Date(2013, 2, 5),
        grade: '5',
        class: '5C',
        parentIds: [parent2._id],
        teacherId: teacher._id,
        busId: bus2._id,
        rfidTag: 'RFID-003',
        smartwatchId: 'SW-003',
        address: {
          street: 'Third Street',
          city: 'Dubai',
          building: 'Building 3',
          apartment: '303',
          coordinates: { lat: 25.2200, lng: 55.2900 },
        },
        emergencyContacts: [
          {
            name: 'Emergency Contact 3',
            relationship: 'Grandfather',
            phone: '9000000000',
          },
        ],
      },
    ]);

    // Link students to parents and bus
    await Promise.all([
      User.findByIdAndUpdate(parent1._id, {
        studentIds: [student1._id, student2._id],
      }),
      User.findByIdAndUpdate(parent2._id, {
        studentIds: [student2._id, student3._id],
      }),
      Bus.findByIdAndUpdate(bus1._id, {
        studentIds: [student1._id, student2._id],
      }),
      Bus.findByIdAndUpdate(bus2._id, {
        studentIds: [student3._id],
      }),
    ]);

    console.log('📅 Creating attendance records...');
    const today = new Date();
    await Attendance.create([
      {
        studentId: student1._id,
        date: today,
        type: 'school_entry',
        location: 'school',
        method: 'rfid',
        coordinates: { lat: 25.2048, lng: 55.2708 },
        verifiedBy: staff._id,
      },
      {
        studentId: student1._id,
        date: today,
        type: 'school_exit',
        location: 'school',
        method: 'rfid',
        coordinates: { lat: 25.2048, lng: 55.2708 },
        verifiedBy: staff._id,
      },
      {
        studentId: student2._id,
        date: today,
        type: 'bus_boarding',
        location: 'bus',
        method: 'rfid',
        coordinates: { lat: 25.2100, lng: 55.2800 },
        verifiedBy: driver._id,
      },
    ]);

    console.log('🚸 Creating pickup and dismissal requests...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pickup = await Pickup.create({
      studentId: student1._id,
      requestedBy: parent1._id,
      pickupDate: tomorrow,
      pickupTime: '13:30',
      authorizedPerson: {
        name: 'Authorized Person 1',
        relationship: 'Brother',
        phone: '7111111111',
        idNumber: 'ID-123456',
      },
      status: 'approved',
      approvedBy: admin._id,
      approvedAt: new Date(),
      qrCode: 'PICKUP-QR-001',
      verificationMethod: 'qr',
    });

    const dismissal = await Dismissal.create({
      studentId: student2._id,
      requestedBy: parent1._id,
      dismissalDate: tomorrow,
      dismissalTime: '12:00',
      reason: 'Doctor appointment',
      status: 'approved',
      teacherApproval: {
        approved: true,
        approvedBy: teacher._id,
        approvedAt: new Date(),
        notes: 'Approved by homeroom teacher',
      },
      adminApproval: {
        approved: true,
        approvedBy: admin._id,
        approvedAt: new Date(),
        notes: 'Approved by administration',
      },
    });

    console.log('📚 Creating academic data (exams, assignments, grades)...');
    const exam = await Exam.create({
      title: 'Math Midterm Exam',
      subject: 'Math',
      grade: '3',
      class: '3A',
      date: today,
      duration: 60,
      maxGrade: 100,
      createdBy: teacher._id,
      studentIds: [student1._id, student2._id],
    });

    const assignment = await Assignment.create({
      title: 'Science Project',
      subject: 'Science',
      grade: '4',
      class: '4B',
      dueDate: tomorrow,
      maxGrade: 100,
      description: 'Create a model of the solar system',
      createdBy: teacher._id,
      studentIds: [student2._id, student3._id],
    });

    await Grade.create([
      {
        studentId: student1._id,
        subject: 'Math',
        grade: 95,
        maxGrade: 100,
        type: 'exam',
        examId: exam._id,
        gradedBy: teacher._id,
      },
      {
        studentId: student2._id,
        subject: 'Math',
        grade: 88,
        maxGrade: 100,
        type: 'exam',
        examId: exam._id,
        gradedBy: teacher._id,
      },
      {
        studentId: student2._id,
        subject: 'Science',
        grade: 92,
        maxGrade: 100,
        type: 'assignment',
        assignmentId: assignment._id,
        gradedBy: teacher._id,
      },
    ]);

    console.log('🧭 Creating behavior records...');
    const behavior = await Behavior.create({
      studentId: student1._id,
      type: 'positive',
      category: 'respect',
      description: 'Helped a classmate with homework',
      severity: 'low',
      reportedBy: teacher._id,
      location: 'Classroom',
      actionTaken: 'Verbal praise and positive note to parents',
      parentNotified: true,
      parentNotifiedAt: new Date(),
    });

    console.log('🎯 Creating activities...');
    const activity = await Activity.create({
      title: 'Football Tournament',
      description: 'Inter-class football tournament',
      type: 'sports',
      date: tomorrow,
      startTime: '15:00',
      endTime: '17:00',
      location: 'School Playground',
      organizerId: staff._id,
      studentIds: [student1._id, student2._id, student3._id],
      maxParticipants: 30,
      status: 'upcoming',
      requirements: ['Sportswear', 'Water bottle'],
    });

    console.log('🔔 Creating notifications...');
    await Notification.create([
      {
        userId: parent1._id,
        title: 'Student arrival at school',
        message: `${student1.name} has arrived at school.`,
        type: 'attendance',
        relatedId: student1._id,
        relatedModel: 'Student',
        priority: 'low',
      },
      {
        userId: parent1._id,
        title: 'Pickup request approved',
        message: `Pickup request for ${student1.name} has been approved.`,
        type: 'pickup',
        relatedId: pickup._id,
        relatedModel: 'Pickup',
        priority: 'medium',
      },
      {
        userId: parent1._id,
        title: 'Early dismissal approved',
        message: `Early dismissal for ${student2.name} has been approved.`,
        type: 'dismissal',
        relatedId: dismissal._id,
        relatedModel: 'Dismissal',
        priority: 'medium',
      },
      {
        userId: parent1._id,
        title: 'New grade posted',
        message: `A new Math grade has been posted for ${student1.name}.`,
        type: 'academic',
        relatedId: exam._id,
        relatedModel: 'Grade',
        priority: 'medium',
      },
      {
        userId: parent2._id,
        title: 'Behavior update',
        message: `New positive behavior recorded for ${student1.name}.`,
        type: 'behavior',
        relatedId: behavior._id,
        relatedModel: 'Behavior',
        priority: 'low',
      },
      {
        userId: parent1._id,
        title: 'New activity',
        message: `${activity.title} is scheduled for tomorrow.`,
        type: 'activity',
        relatedId: activity._id,
        relatedModel: 'Activity',
        priority: 'low',
      },
      {
        userId: parent1._id,
        title: 'Bus location update',
        message: `Bus ${bus1.busNumber} is approaching your stop.`,
        type: 'bus',
        relatedId: bus1._id,
        relatedModel: 'Bus',
        priority: 'high',
      },
      {
        userId: admin._id,
        title: 'System initialized',
        message: 'Initial demo data has been seeded successfully.',
        type: 'system',
        priority: 'low',
      },
    ]);

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

seed();

