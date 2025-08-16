import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR',
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending',
  },
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpaySignature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  invoiceNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  invoicePath: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['booking_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['razorpay_order_id']
    },
    {
      fields: ['razorpay_payment_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['transaction_id']
    }
  ]
});

export default Payment;
