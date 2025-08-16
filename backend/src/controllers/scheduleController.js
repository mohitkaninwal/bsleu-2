import Schedule from '../models/Schedule.js';
import logger from '../utils/logger.js';

// @desc    Create a new exam schedule
export const createSchedule = async (req, res) => {
  try {
    const { examDate, examTime, examLevel, examType, totalSlots } = req.body;
    // enforce single center model
    const testCenter = process.env.EXAM_CENTER || 'BSLEU Main Center, New Delhi';
    if (!['morning', 'evening'].includes(examTime)) {
      return res.status(400).json({ success: false, message: 'examTime must be morning or evening' });
    }
    const schedule = await Schedule.create({
      examDate,
      examTime,
      testCenter,
      examLevel,
      examType,
      totalSlots,
      bookedSlots: 0,
      isActive: true,
    });
    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    logger.error('Create Schedule Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating schedule' });
  }
};

// @desc    Get all available exam schedules
export const getSchedules = async (req, res) => {
  try {
    const { level, type, date } = req.query;
    const where = { isActive: true };
    if (level) where.examLevel = level;
    if (type) where.examType = type;
    if (date) where.examDate = date;
    const schedules = await Schedule.findAll({ 
      where, 
      order: [['exam_date', 'ASC']],
      attributes: [
        'id', 'examDate', 'examTime', 'testCenter', 'examLevel', 'examType', 
        'totalSlots', 'bookedSlots', 'isActive', 'createdAt', 'updatedAt'
      ]
    });
    res.json({ success: true, data: schedules });
  } catch (error) {
    logger.error('Get Schedules Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching schedules' });
  }
};

// @desc    Update an exam schedule
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { examDate, examTime, examLevel, examType, totalSlots, isActive } = req.body;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });
    if (examTime && !['morning', 'evening'].includes(examTime)) {
      return res.status(400).json({ success: false, message: 'examTime must be morning or evening' });
    }
    await schedule.update({ examDate, examTime, examLevel, examType, totalSlots, isActive });
    res.json({ success: true, data: schedule });
  } catch (error) {
    logger.error('Update Schedule Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating schedule' });
  }
};

// @desc    Delete an exam schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });
    await schedule.destroy();
    res.json({ success: true, message: 'Schedule deleted' });
  } catch (error) {
    logger.error('Delete Schedule Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting schedule' });
  }
};
