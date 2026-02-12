const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const FamilyMember = require('../models/FamilyMember');
const Record = require('../models/Record');
const VitalLog = require('../models/VitalLog');

// @route   PUT api/user
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
    try {
        const { name, phone, gender, dob } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phoneNumber = phone;
        if (gender) user.gender = gender;
        if (dob) user.dob = dob;

        await user.save();

        // Remove password/sensitive fields if any before returning
        const userObj = user.toObject();
        delete userObj.password;

        res.json(userObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/user
// @desc    Delete user account and all related data
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // Delete related data first
        await FamilyMember.deleteMany({ user_id: req.user.id });
        await Record.deleteMany({ user_id: req.user.id });
        await VitalLog.deleteMany({ user_id: req.user.id });

        // Delete user
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'User account deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/user
// @desc    Get current user info
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
