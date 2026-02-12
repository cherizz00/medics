const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Record = require('../models/Record'); // Switched to new Record model

// @route   GET api/documents
// @desc    Get all user records
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Fetch records for the user
        const records = await Record.find({ user_id: req.user.id }).sort({ createdAt: -1 });

        // Map to frontend expected format if needed, or frontend adapts.
        // Frontend expects: title, fileUrl, category, size, uploadedAt/date
        const documents = records.map(rec => ({
            _id: rec._id,
            title: rec.title,
            fileUrl: rec.file_url,
            category: mapTypeToCategory(rec.type),
            size: 'Unknown', // Record model doesn't strictly have size, could store in tags or metadata
            uploadedAt: rec.createdAt,
            type: rec.type,
            doctor: rec.doctor_name
        }));

        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/documents
// @desc    Add new record
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, fileUrl, category, size, doctor } = req.body;

        const newRecord = new Record({
            user_id: req.user.id,
            title,
            file_url: fileUrl,
            type: mapCategoryToType(category),
            doctor_name: doctor,
            tags: [category, size] // Store size and original category in tags
        });

        const savedRecord = await newRecord.save();

        // Return in frontend format
        res.json({
            _id: savedRecord._id,
            title: savedRecord.title,
            fileUrl: savedRecord.file_url,
            category: mapTypeToCategory(savedRecord.type),
            size: size,
            uploadedAt: savedRecord.createdAt
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/documents/:id
// @desc    Delete record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Check user
        if (record.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Record.findByIdAndDelete(req.params.id);

        res.json({ message: 'Record removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Helpers
function mapCategoryToType(category) {
    const map = {
        'Laboratory': 'lab_report',
        'Pharmacy': 'prescription',
        'Radiology': 'scan',
        'General': 'other'
    };
    return map[category] || 'other';
}

function mapTypeToCategory(type) {
    const map = {
        'lab_report': 'Laboratory',
        'prescription': 'Pharmacy',
        'scan': 'Radiology',
        'other': 'General'
    };
    return map[type] || 'General';
}

module.exports = router;
