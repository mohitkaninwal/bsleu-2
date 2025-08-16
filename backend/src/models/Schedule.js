import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  examDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  examTime: {
    // Store simplified slot label: 'morning' | 'evening'
    type: DataTypes.STRING,
    allowNull: false,
  },
  testCenter: {
    // Single center model; store name/address directly
    type: DataTypes.STRING,
    allowNull: false,
  },
  examLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  examType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalSlots: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bookedSlots: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'schedules',
  timestamps: true,
  underscored: true, 
  indexes: [
    {
      unique: true,
      fields: ['exam_date', 'exam_time', 'test_center', 'exam_level', 'exam_type'],
      name: 'unique_schedule_slot'
    },
  ],
});

export default Schedule;
