import db from '../models/index.js';
import logger from '../utils/logger.js';

const initializeDatabase = async () => {
  try {
    // First, authenticate the connection
    await db.sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // Only force recreate tables when explicitly requested
    const shouldForceSync = process.env.DB_FORCE_SYNC === 'true';
    
    if (shouldForceSync) {
      logger.info('Force syncing database (DB_FORCE_SYNC=true)...');
      await db.sequelize.sync({ force: true });
      logger.info('Database tables recreated successfully.');
    } else {
      // Use alter for production or when preserving data
      logger.info('Syncing database schema...');
      await db.sequelize.sync({ alter: true });
      logger.info('Database schema synchronized successfully.');
    }

  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  }
};

export default initializeDatabase;
