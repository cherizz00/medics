const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InsuranceInsight = require('../models/InsuranceInsight');
const multer = require('multer');

const upload = multer({ dest: 'uploads/temp/' });

// @route   GET api/insurance
// @desc    Get user insurance insights
router.get('/', auth, async (req, res) => {
    try {
        const insights = await InsuranceInsight.findOne({ user_id: req.user.id }).sort({ uploaded_at: -1 });
        res.json(insights || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/insurance/analyze
// @desc    Upload policy and generate mock insights
router.post('/analyze', [auth, upload.single('policy')], async (req, res) => {
    try {
        // In a real app, we would use OCR (Tesseract/Google Vision) here.
        // For MVP, we generate mock data based on randomness to simulate "AI Analysis"

        const providers = ['Aetna', 'BlueCross', 'Cigna', 'UnitedHealth', 'Kaiser'];
        const provider = providers[Math.floor(Math.random() * providers.length)];

        const insight = new InsuranceInsight({
            user_id: req.user.id,
            policy_number: `POL-${Math.floor(Math.random() * 1000000)}`,
            provider: provider,
            coverage_limit: 500000,
            premium_amount: 450,
            expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            covered_items: ['Hospitalization', 'Surgery', 'Prescriptions', 'Wellness Visits'],
            not_covered_items: ['Cosmetic Surgery', 'Experimental Treatments', 'Dental Implants'],
            gaps: ['No Dental Coverage detected', 'High Deductible ($5,000)']
        });

        await insight.save();

        // Simulate processing delay
        setTimeout(() => { }, 1000);

        res.json(insight);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Analysis failed' });
    }
});

module.exports = router;
