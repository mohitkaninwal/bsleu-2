import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('booking_confirmation', 'payment_receipt', 'exam_reminder', 'cancellation', 'reschedule', 'document_verified', 'account_update', 'general'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  relatedEntityId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  relatedEntityType: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['is_read']
    },
    {
      fields: ['type']
    }
  ]
});

export default Notification;
