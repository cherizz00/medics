const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const verifyPremium = require('../middleware/premium');
const ReminderLog = require('../models/ReminderLog');

// @route   GET api/reminders
// @desc    Get user's reminders (can filter by date/status)
router.get('/', auth, async (req, res) => {
    try {
        const reminders = await ReminderLog.find({ user_id: req.user.id })
            .sort({ scheduled_time: 1 });
        res.json(reminders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/reminders
// @desc    Create a new reminder (Premium Feature)
router.post('/', [auth, verifyPremium], async (req, res) => {
    try {
        const { title, type, scheduled_time, dosage, notes } = req.body;

        const newReminder = new ReminderLog({
            user_id: req.user.id,
            title,
            type,
            scheduled_time,
            dosage,
            notes
        });

        const savedReminder = await newReminder.save();
        res.json(savedReminder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/reminders/:id
// @desc    Update status (e.g., mark as taken)
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body; // 'taken', 'skipped'

        let reminder = await ReminderLog.findById(req.params.id);
        if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

        if (reminder.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        reminder.status = status;
        if (status === 'taken') {
            reminder.taken_time = new Date();
        }

        await reminder.save();
        res.json(reminder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE api/reminders/:id
// @desc    Delete a reminder
router.delete('/:id', auth, async (req, res) => {
    try {
        const reminder = await ReminderLog.findById(req.params.id);
        if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

        if (reminder.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await reminder.deleteOne();
        res.json({ message: 'Reminder removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
