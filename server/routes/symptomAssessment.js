const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SymptomAssessment = require('../models/SymptomAssessment');
const HealthBotSession = require('../models/HealthBotSession');
const VaultDocument = require('../models/VaultDocument');

// @route   POST api/symptoms/assessment
// @desc    Finalize a session into a structured assessment
router.post('/assessment', auth, async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await HealthBotSession.findOne({ _id: sessionId, user_id: req.user.id });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Logic to extract structured symptoms from chat messages could be advanced.
        // For MVP, we'll use the risk metadata from the session.

        const assessment = new SymptomAssessment({
            user_id: req.user.id,
            symptoms: session.messages
                .filter(m => m.sender === 'user')
                .map(m => ({ name: m.text, severity: 'moderate' })), // Simplified mapping
            risk_score: session.risk_score,
            risk_level: session.risk_score >= 80 ? 'critical' : session.risk_score >= 50 ? 'high' : session.risk_score >= 20 ? 'medium' : 'low',
            recommendations: session.messages
                .filter(m => m.sender === 'bot' && m.metadata && m.metadata.recommendations)
                .flatMap(m => m.metadata.recommendations),
            notes: `Converted from AI Chat session started at ${session.started_at}`
        });

        await assessment.save();

        // Create a VaultDocument entry so it shows up in the Vault
        const vaultDoc = new VaultDocument({
            user_id: req.user.id,
            filename: `AI Health Assessment - ${new Date().toLocaleDateString()}`,
            mime_type: 'application/json',
            is_assessment: true,
            assessment_id: assessment._id
        });
        await vaultDoc.save();

        // Mark session as completed
        session.status = 'completed';
        await session.save();

        res.json(assessment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating assessment' });
    }
});

// @route   GET api/symptoms/assessment
// @desc    Get all assessments for user
router.get('/assessment', auth, async (req, res) => {
    try {
        const assessments = await SymptomAssessment.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        res.json(assessments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching assessments' });
    }
});

module.exports = router;
