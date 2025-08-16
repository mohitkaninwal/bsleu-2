import express from 'express';
import { createSchedule, getSchedules, updateSchedule, deleteSchedule } from '../controllers/scheduleController.js';
const router = express.Router();

// @route   POST api/schedules
// @desc    Create a new exam schedule
// @access  Admin
router.post('/', createSchedule);

// @route   GET api/schedules
// @desc    Get all available exam schedules
// @access  Public
router.get('/', getSchedules);

// @route   PUT api/schedules/:id
// @desc    Update an exam schedule
// @access  Admin
router.put('/:id', updateSchedule);

// @route   DELETE api/schedules/:id
// @desc    Delete an exam schedule
// @access  Admin
router.delete('/:id', deleteSchedule);

export default router;
