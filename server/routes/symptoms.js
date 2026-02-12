const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthBotSession = require('../models/HealthBotSession');

// --- Helper: Mock NLP & Risk Assessment ---
const analyzeSymptoms = (text) => {
    let riskScore = 0;
    let riskLevel = 'low';
    let recommendations = ['Rest and hydration', 'Monitor symptoms'];
    const lowerText = text.toLowerCase();

    // Keywords based scoring
    const criticalKeywords = ['chest pain', 'trouble breathing', 'unconscious', 'stroke', 'heart attack', 'severe bleeding'];
    const highKeywords = ['high fever', 'severe pain', 'vomiting blood', 'fainting', 'confusion'];
    const mediumKeywords = ['fever', 'cough', 'headache', 'rash', 'stomach ache', 'diarrhea'];

    if (criticalKeywords.some(k => lowerText.includes(k))) {
        riskScore += 90;
    } else if (highKeywords.some(k => lowerText.includes(k))) {
        riskScore += 50;
    } else if (mediumKeywords.some(k => lowerText.includes(k))) {
        riskScore += 20;
    }

    // Determine Level
    if (riskScore >= 80) {
        riskLevel = 'critical';
        recommendations = ['Seek immediate emergency care', 'Call an ambulance'];
    } else if (riskScore >= 50) {
        riskLevel = 'high';
        recommendations = ['Consult a doctor immediately', 'Visit urgent care'];
    } else if (riskScore >= 20) {
        riskLevel = 'medium';
        recommendations = ['Schedule a doctor appointment', 'Rest and observe'];
    }

    return { riskScore, riskLevel, recommendations };
};

// @route   GET api/symptoms/session
// @desc    Get current active chat session
router.get('/session', auth, async (req, res) => {
    try {
        let session = await HealthBotSession.findOne({ user_id: req.user.id, status: 'active' });

        if (!session) {
            // Start new session
            session = new HealthBotSession({
                user_id: req.user.id,
                messages: [{
                    sender: 'bot',
                    text: "Hi! I'm your AI Health Assistant. Describe your symptoms, and I'll assess your risk.",
                    timestamp: new Date()
                }]
            });
            await session.save();
        }
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching session' });
    }
});

// @route   POST api/symptoms/chat
// @desc    Send message to bot and get analysis
router.post('/chat', auth, async (req, res) => {
    try {
        const { text } = req.body;
        let session = await HealthBotSession.findOne({ user_id: req.user.id, status: 'active' });

        if (!session) {
            return res.status(404).json({ message: 'No active session found' });
        }

        // 1. Add User Message
        session.messages.push({ sender: 'user', text });

        // 2. Analyze
        const analysis = analyzeSymptoms(text);

        // 3. Formulate Bot Response
        let botText = '';
        if (analysis.riskScore > 0) {
            botText = `I've analyzed your symptoms. \n\n🔴 **Risk Level:** ${analysis.riskLevel.toUpperCase()} \n⚠️ **Score:** ${analysis.riskScore}/100 \n\n📋 **Recommendation:** ${analysis.recommendations.join(', ')}.`;
            session.risk_score = Math.max(session.risk_score, analysis.riskScore); // Keep highest risk detected
        } else {
            botText = "I see. Could you provide more details about how you are feeling? Are you experiencing any pain or fever?";
        }

        session.messages.push({
            sender: 'bot',
            text: botText,
            metadata: analysis
        });

        session.last_updated = new Date();
        await session.save();

        res.json(session);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error processing chat' });
    }
});

module.exports = router;
