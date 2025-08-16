import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: true, // A document might not be tied to a specific booking
  },
  documentType: {
    type: DataTypes.ENUM('passport_front', 'passport_back', 'passport_photo', 'telc_certificate'),
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  verifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verificationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  s3Key: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  s3Bucket: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastDownloadedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'documents',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['booking_id']
    },
    {
      fields: ['document_type']
    },
    {
      fields: ['verification_status']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default Document;
