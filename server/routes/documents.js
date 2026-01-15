const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Document = require('../models/Document');

// @route   GET api/documents
// @desc    Get all user documents
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/documents
// @desc    Add new document
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, fileUrl, category, size } = req.body;

        const newDocument = new Document({
            userId: req.user.id,
            title,
            fileUrl,
            category,
            size
        });


        const document = await newDocument.save();
        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/documents/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check user
        if (document.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Document.findByIdAndDelete(req.params.id);

        res.json({ message: 'Document removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
