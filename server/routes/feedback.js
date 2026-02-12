const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');

// @route   POST api/feedback
// @desc    Submit feedback
router.post('/', auth, async (req, res) => {
    try {
        const { type, message, rating } = req.body;
        const newFeedback = new Feedback({
            user_id: req.user.id,
            type,
            message,
            rating
        });
        await newFeedback.save();
        res.json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
