import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bookingReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  scheduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  examLevel: {
    type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'B1-P', 'B2-P', 'C1', 'C1-P'),
    allowNull: false,
  },
  examType: {
    type: DataTypes.ENUM('full', 'partial'),
    allowNull: false,
    defaultValue: 'full',
  },
  partialComponent: {
    type: DataTypes.ENUM('written', 'oral'),
    allowNull: true, // Only required for partial exams
  },
  examFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR',
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  documentVerificationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'schedule_id'],
      name: 'unique_user_schedule_booking'
    }
  ]
});

export default Booking;
