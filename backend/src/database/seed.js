// Seed demo users, schedules, and bookings
import dotenv from 'dotenv';
dotenv.config();
import db from '../models/index.js';
import User from '../models/User.js';
import Schedule from '../models/Schedule.js';
import Booking from '../models/Booking.js';
import logger from '../utils/logger.js';

const MAIN_CENTER = process.env.EXAM_CENTER || 'BSLEU Main Center, New Delhi';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bsleu.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password1234';

async function run() {
  try {
    await db.sequelize.authenticate();
    logger.info('Seeding: DB connected');

    // Ensure tables exist
    await db.sequelize.sync({ alter: true });

    // Create demo users
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: ADMIN_EMAIL },
      defaults: {
        familyName: 'Admin',
        firstName: 'Super',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        telephone: '+911100000000',
        dateOfBirth: '1990-01-01',
        birthPlace: 'Delhi',
        countryOfBirth: 'India',
        nativeLanguage: 'English',
        gender: 'male',
        placeOfResidence: 'New Delhi',
        countryOfResidence: 'India',
        isActive: true,
      }
    });

    // If admin already exists, ensure role and password match env
    if (!adminCreated) {
      let changed = false;
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        changed = true;
      }
      if (ADMIN_PASSWORD) {
        admin.password = ADMIN_PASSWORD; // hashed by beforeUpdate hook
        changed = true;
      }
      if (changed) {
        await admin.save();
        logger.info('Updated existing admin user with env credentials.');
      }
    } else {
      logger.info('Created admin user from env credentials.');
    }

    const [user1] = await User.findOrCreate({
      where: { email: 'john@example.com' },
      defaults: {
        familyName: 'Doe',
        firstName: 'John',
        email: 'john@example.com',
        password: 'password1234',
        telephone: '+919999999991',
        dateOfBirth: '1998-05-12',
        birthPlace: 'Mumbai',
        countryOfBirth: 'India',
        nativeLanguage: 'English',
        gender: 'male',
        placeOfResidence: 'Mumbai',
        countryOfResidence: 'India',
        isActive: true,
      }
    });

    const [user2] = await User.findOrCreate({
      where: { email: 'jane@example.com' },
      defaults: {
        familyName: 'Smith',
        firstName: 'Jane',
        email: 'jane@example.com',
        password: 'password1234',
        telephone: '+919999999992',
        dateOfBirth: '1995-10-20',
        birthPlace: 'Bengaluru',
        countryOfBirth: 'India',
        nativeLanguage: 'English',
        gender: 'female',
        placeOfResidence: 'Bengaluru',
        countryOfResidence: 'India',
        isActive: true,
      }
    });

    // Create schedules (morning/evening)
    const [sch1] = await Schedule.findOrCreate({
      where: { examDate: '2025-09-01', examTime: 'morning', examLevel: 'B1', examType: 'full', testCenter: MAIN_CENTER },
      defaults: { totalSlots: 20, bookedSlots: 0, isActive: true }
    });
    const [sch2] = await Schedule.findOrCreate({
      where: { examDate: '2025-09-01', examTime: 'evening', examLevel: 'B1', examType: 'full', testCenter: MAIN_CENTER },
      defaults: { totalSlots: 20, bookedSlots: 0, isActive: true }
    });
    const [sch3] = await Schedule.findOrCreate({
      where: { examDate: '2025-09-05', examTime: 'morning', examLevel: 'C1', examType: 'full', testCenter: MAIN_CENTER },
      defaults: { totalSlots: 15, bookedSlots: 0, isActive: true }
    });

    // Create bookings
    const [bk1] = await Booking.findOrCreate({
      where: { bookingReference: 'BSLEU-SEED-1' },
      defaults: {
        userId: user1.id,
        scheduleId: sch1.id,
        examLevel: 'B1',
        examType: 'full',
        examFee: 21240,
        currency: 'INR',
        status: 'confirmed',
        paymentStatus: 'paid',
      }
    });

    const [bk2] = await Booking.findOrCreate({
      where: { bookingReference: 'BSLEU-SEED-2' },
      defaults: {
        userId: user2.id,
        scheduleId: sch3.id,
        examLevel: 'C1',
        examType: 'full',
        examFee: 23600,
        currency: 'INR',
        status: 'confirmed',
        paymentStatus: 'paid',
      }
    });

    // Update booked slots counts
    await sch1.update({ bookedSlots: await Booking.count({ where: { scheduleId: sch1.id } }) });
    await sch2.update({ bookedSlots: await Booking.count({ where: { scheduleId: sch2.id } }) });
    await sch3.update({ bookedSlots: await Booking.count({ where: { scheduleId: sch3.id } }) });

    logger.info('Seeding complete');
    process.exit(0);
  } catch (err) {
    logger.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();


