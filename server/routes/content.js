const express = require('express');
const router = express.Router();
const EducationalContent = require('../models/EducationalContent');

// @route   GET api/content/stories
// @desc    Get all stories
router.get('/stories', async (req, res) => {
    try {
        let stories = await EducationalContent.find({ category: 'stories' }).sort({ createdAt: -1 });

        // If no stories exist, seed some default ones
        if (stories.length === 0) {
            const seedStories = [
                {
                    title: 'Cholesterol 101',
                    category: 'stories',
                    content_url: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=500&q=80',
                    description: 'Understanding good vs bad cholesterol.',
                    tags: ['Heart', 'Diet'],
                    is_premium: false
                },
                {
                    title: 'Gout Triggers',
                    category: 'stories',
                    content_url: 'https://images.unsplash.com/photo-1542834371-410e35593e02?auto=format&fit=crop&w=500&q=80',
                    description: 'Foods to avoid if you have uric acid issues.',
                    tags: ['Arthritis', 'Diet'],
                    is_premium: false
                },
                {
                    title: 'HRV Explained',
                    category: 'stories',
                    content_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=80',
                    description: 'Why Heart Rate Variability matters for stress.',
                    tags: ['Heart', 'Tech'],
                    is_premium: true
                },
                {
                    title: 'Gluten Free?',
                    category: 'stories',
                    content_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=500&q=80',
                    description: 'Is gluten-free really healthier for everyone?',
                    tags: ['Diet', 'Wellness'],
                    is_premium: true
                }
            ];
            stories = await EducationalContent.insertMany(seedStories);
        }

        res.json(stories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching stories' });
    }
});

// @route   POST api/content
// @desc    Add new content (Admin/Dev)
router.post('/', async (req, res) => {
    try {
        const newContent = new EducationalContent(req.body);
        await newContent.save();
        res.json(newContent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
