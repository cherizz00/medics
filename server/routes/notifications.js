const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// @route   GET api/notifications
// @desc    Get user notifications
router.get('/', auth, async (req, res) => {
    try {
        let notifications = await Notification.find({ user_id: req.user.id }).sort({ created_at: -1 });

        // Seed default notifications if none exist
        if (notifications.length === 0) {
            const seed = [
                {
                    user_id: req.user.id,
                    title: 'Welcome to Medics!',
                    message: 'Your ultra-premium healthcare dashboard is ready. Start by scanning your records.',
                    type: 'system'
                },
                {
                    user_id: req.user.id,
                    title: 'Hydration Reminder',
                    message: 'Based on your activity, you should drink 500ml of water now.',
                    type: 'reminder'
                },
                {
                    user_id: req.user.id,
                    title: 'Vital Insight',
                    message: 'Your resting heart rate is very stable today. Great job!',
                    type: 'premium'
                }
            ];
            notifications = await Notification.insertMany(seed);
        }

        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Not found' });
        if (notification.user_id.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        notification.is_read = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
