const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FamilyMember = require('../models/FamilyMember');

// @route   GET api/family
// @desc    Get all family members
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const members = await FamilyMember.find({ primary_user_id: req.user.id });
        res.json(members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/family
// @desc    Add family member
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { name, relation, dob, gender, blood_group, phoneNumber } = req.body;

        // Check if there's a User with this phone number to link
        let linked_user_id = null;
        if (phoneNumber) {
            const User = require('../models/User'); // Import inside to avoid circular dependency if any
            const existingUser = await User.findOne({ phoneNumber });
            if (existingUser) {
                linked_user_id = existingUser._id;
            }
        }

        const newMember = new FamilyMember({
            primary_user_id: req.user.id,
            name,
            relation,
            dob,
            gender,
            blood_group,
            phoneNumber,
            linked_user_id,
            avatar_url: `https://ui-avatars.com/api/?name=${name}&background=random`
        });

        const member = await newMember.save();
        res.json(member);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/family/:id
// @desc    Delete family member
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const member = await FamilyMember.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Check user
        if (member.primary_user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await FamilyMember.findByIdAndDelete(req.params.id);

        res.json({ message: 'Member removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
