import cron from 'node-cron';
import logger from '../utils/logger.js';

const scheduleExamReminders = () => {
    // Example: Run a job every day at 9:00 AM
    cron.schedule('0 9 * * *', () => {
        logger.info('Running scheduled job: Send Exam Reminders');
        // Add logic to find upcoming exams and send reminders
    });
};

export const startCronJobs = () => {
    scheduleExamReminders();
    logger.info('Cron jobs initialized.');
};
