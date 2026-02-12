const express = require('express');
const router = express.Router();
const VitalLog = require('../models/VitalLog');
// Authorization middleware placeholder - assumes 'req.user' is populated by auth middleware
const auth = require('../middleware/auth');

// @route GET /api/vitals
// @desc Get all vitals for a user (or specific type via query)
router.get('/', auth, async (req, res) => {
    try {
        const { type, family_member_id } = req.query;
        let query = { user_id: req.user.id };

        if (type) query.type = type;
        if (family_member_id) query.family_member_id = family_member_id;

        const vitals = await VitalLog.find(query).sort({ date: -1 }).limit(50);
        res.json(vitals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching vitals' });
    }
});

// @route POST /api/vitals
// @desc Log a new vital
router.post('/', auth, async (req, res) => {
    try {
        const { type, value, unit, family_member_id, notes, date, source } = req.body;

        const newVital = new VitalLog({
            user_id: req.user.id,
            family_member_id: family_member_id || null, // Optional
            type,
            value,
            unit,
            notes,
            date: date || Date.now(),
            source: source || 'manual'
        });

        const savedVital = await newVital.save();
        res.json(savedVital);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error logging vital' });
    }
});

// @route DELETE /api/vitals/:id
// @desc Delete a vital log
router.delete('/:id', auth, async (req, res) => {
    try {
        const vital = await VitalLog.findById(req.params.id);
        if (!vital) return res.status(404).json({ message: 'Vital log not found' });

        // Check ownership
        if (vital.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await vital.deleteOne();
        res.json({ message: 'Vital log removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting vital' });
    }
});

module.exports = router;
