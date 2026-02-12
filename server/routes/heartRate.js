const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HeartRateLog = require('../models/HeartRateLog');

// @route   POST api/heart-rate
// @desc    Log a heart rate measurement
router.post('/', auth, async (req, res) => {
    try {
        const { bpm, raw_data } = req.body;

        const log = new HeartRateLog({
            user_id: req.user.id,
            bpm,
            raw_data,
            confidence: 90 // Mock confidence
        });

        await log.save();
        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error logging heart rate' });
    }
});

// @route   GET api/heart-rate
// @desc    Get recent logs
router.get('/', auth, async (req, res) => {
    try {
        const logs = await HeartRateLog.find({ user_id: req.user.id })
            .sort({ timestamp: -1 })
            .limit(20);
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching logs' });
    }
});

module.exports = router;
