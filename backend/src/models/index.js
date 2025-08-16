import sequelize from '../database/connection.js';
import User from './User.js';
import Schedule from './Schedule.js';
import Booking from './Booking.js';
import Payment from './Payment.js';
import Document from './Document.js';
import Notification from './Notification.js';

const models = {
  User,
  Schedule,
  Booking,
  Payment,
  Document,
  Notification,
};

// Define associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Schedule.hasMany(Booking, { foreignKey: 'scheduleId' });
Booking.belongsTo(Schedule, { foreignKey: 'scheduleId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Booking.hasOne(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

User.hasMany(Document, { foreignKey: 'userId' });
Document.belongsTo(User, { foreignKey: 'userId' });

Booking.hasMany(Document, { foreignKey: 'bookingId' });
Document.belongsTo(Booking, { foreignKey: 'bookingId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

const db = {
  ...models,
  sequelize,
};

export default db;
