const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthBotSession = require('../models/HealthBotSession');
const User = require('../models/User');

// --- Helper: Mock NLP \u0026 Risk Assessment ---
const analyzeSymptoms = (text) => {
    let riskScore = 0;
    let riskLevel = 'low';
    let recommendations = ['Rest and hydration', 'Monitor symptoms'];
    const lowerText = text.toLowerCase();

    // Negation detection helpers
    const negations = ['no', 'not', 'don\'t', 'dont', 'never', 'without', 'none', 'neither', 'nor'];

    // Function to check if a keyword is negated in the text
    const isNegated = (keyword, fullText) => {
        const words = fullText.split(/\s+/);
        const kwIndex = words.indexOf(keyword);
        if (kwIndex <= 0) return false;

        // Check 1-2 words before for negations
        const prev1 = words[kwIndex - 1];
        const prev2 = kwIndex > 1 ? words[kwIndex - 2] : null;

        return negations.includes(prev1) || negations.includes(prev2);
    };

    // Keywords based scoring
    const criticalKeywords = ['chest pain', 'trouble breathing', 'unconscious', 'stroke', 'heart attack', 'severe bleeding', 'seizure', 'accident', 'trauma'];
    const highKeywords = ['high fever', 'severe pain', 'vomiting blood', 'fainting', 'confusion', 'blurred vision', 'injury', 'broken bone'];
    const mediumKeywords = ['fever', 'cough', 'headache', 'rash', 'stomach ache', 'diarrhea', 'cold', 'chills', 'sore throat', 'body ache', 'fatigue', 'nausea'];

    // Smarter matching logic
    const containsSymptom = (keywords) => {
        return keywords.some(k => {
            if (lowerText.includes(k)) {
                // If it's a single word, check for negation
                if (!k.includes(' ')) {
                    return !isNegated(k, lowerText);
                }
                // For multi-word phrases, we use simple lowerText check as they are rarer in false positives
                // unless the first word is negated.
                const firstWord = k.split(' ')[0];
                return !isNegated(firstWord, lowerText);
            }
            return false;
        });
    };

    if (containsSymptom(criticalKeywords)) {
        riskScore += 90;
    } else if (containsSymptom(highKeywords)) {
        riskScore += 60;
    } else if (containsSymptom(mediumKeywords)) {
        riskScore += 25;
    }

    // Determine Level
    if (riskScore >= 85) {
        riskLevel = 'critical';
        recommendations = ['Seek immediate emergency care', 'Visit nearest Trauma Center'];
    } else if (riskScore >= 55) {
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
                    text: "Hello! I'm Dr. Coach, your personal AI Health Assistant. I'm here to help you understand your symptoms and provide clinical insights based on our database. \n\nHow are you feeling today? You can describe any symptoms or ask a health-related question.",
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
            // Start new session if none is active
            session = new HealthBotSession({
                user_id: req.user.id,
                messages: []
            });
        }

        // 1. Add User Message
        session.messages.push({ sender: 'user', text });

        // 2. Analyze
        const analysis = analyzeSymptoms(text);
        const user = await User.findById(req.user.id);
        const userName = (user && user.name) ? user.name.split(' ')[0] : 'friend';

        // 3. Formulate Bot Response
        let botText = '';
        const lowerText = text.toLowerCase();
        const symptomFound = analysis.riskScore > 0;
        const bookingIntent = lowerText.includes('book') || lowerText.includes('appointment') || lowerText.includes('schedule') || lowerText.includes('doctor');

        // Suggested Specialty Mapping
        let suggestedSpecialty = 'General Physician';
        if (lowerText.includes('heart') || lowerText.includes('chest')) suggestedSpecialty = 'Cardiologist';
        if (lowerText.includes('skin') || lowerText.includes('rash')) suggestedSpecialty = 'Dermatologist';
        if (lowerText.includes('child') || lowerText.includes('kid')) suggestedSpecialty = 'Pediatrician';
        if (lowerText.includes('brain') || lowerText.includes('nerve')) suggestedSpecialty = 'Neurologist';
        if (lowerText.includes('accident') || lowerText.includes('bone') || lowerText.includes('injury') || lowerText.includes('knee')) suggestedSpecialty = 'Orthopedic Surgeon';

        // Mock Recommended Doctor (fetching from hardcoded list for speed)
        const consultancies = [
            { id: 1, name: "Dr. Sarah Johnson", specialty: "General Physician", distance: "0.8 km", rating: 4.8, image: "https://randomuser.me/api/portraits/women/44.jpg" },
            { id: 2, name: "Dr. Michael Chen", specialty: "Cardiologist", distance: "1.2 km", rating: 4.9, image: "https://randomuser.me/api/portraits/men/32.jpg" },
            { id: 3, name: "Dr. Priya Sharma", specialty: "Dermatologist", distance: "2.5 km", rating: 4.7, image: "https://randomuser.me/api/portraits/women/68.jpg" },
            { id: 4, name: "Dr. Robert Wilson", specialty: "Pediatrician", distance: "3.1 km", rating: 4.6, image: "https://randomuser.me/api/portraits/men/91.jpg" },
            { id: 5, name: "Dr. Elena Rodriguez", specialty: "Neurologist", distance: "4.2 km", rating: 4.9, image: "https://randomuser.me/api/portraits/women/22.jpg" },
            { id: 6, name: "Dr. James Miller", specialty: "Orthopedic Surgeon", distance: "0.5 km", rating: 4.9, image: "https://randomuser.me/api/portraits/men/45.jpg" }
        ];
        const recommendedDoctor = consultancies.find(c => c.specialty === suggestedSpecialty) || consultancies[0];

        if (bookingIntent) {
            botText = `Certainly, ${userName}! I've found **${recommendedDoctor.name}**, a highly-rated **${recommendedDoctor.specialty}** just **${recommendedDoctor.distance}** away from you. \n\nWould you like me to go ahead and schedule an appointment for you?`;
        } else if (analysis.riskLevel === 'critical') {
            botText = `🆘 **URGENT:** I'm very concerned about this, ${userName}. Based on the mention of "${text}", this appears to be a **CRITICAL** situation. \n\n🚩 **Risk Level:** CRITICAL \n⚠️ **Score:** ${analysis.riskScore}/100 \n\n📋 **Recommendation:** ${analysis.recommendations.join(', ')}. \n\nI've found **${recommendedDoctor.name}** at a nearby Trauma Center (**${recommendedDoctor.distance}** away). Please confirm if you want me to alert them of your arrival.`;
            session.risk_score = Math.max(session.risk_score, analysis.riskScore);
        } else if (analysis.riskScore >= 50) {
            botText = `I understand, ${userName}. Your symptoms (including "${text}") look concerning. Based on my analysis: \n\n🔴 **Risk Level:** ${analysis.riskLevel.toUpperCase()} \n⚠️ **Score:** ${analysis.riskScore}/100 \n\n📋 **Recommendation:** ${analysis.recommendations.join(', ')}. \n\nI strongly suggest you follow the recommendation above. Shall I help you find a doctor nearby?`;
            session.risk_score = Math.max(session.risk_score, analysis.riskScore);
        } else if (analysis.riskScore >= 20) {
            botText = `I hear you, ${userName}. Based on your mentions of "${text}", it seems like a moderate concern: \n\n🟠 **Risk Level:** ${analysis.riskLevel.toUpperCase()} \n⚠️ **Score:** ${analysis.riskScore}/100 \n\n📋 **Recommendation:** ${analysis.recommendations.join(', ')}. \n\nWould you like me to keep monitoring these symptoms for you?`;
            session.risk_score = Math.max(session.risk_score, analysis.riskScore);
        } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
            botText = `Hello ${userName}! I'm Dr. Coach AI, your personal Medics assistant. I'm here to analyze your symptoms, offer health insights, and help you manage your records. How can I help you feel better today?`;
        } else if (symptomFound) {
            botText = `I see that you're experiencing some symptoms, ${userName}. While they don't seem critical yet, I'd like to know more to be sure. Are you also feeling any pain, fever, or dizziness?`;
            session.risk_score = Math.max(session.risk_score, 10); // Slight bump for tracking
        } else {
            botText = `I'm listening, ${userName}. I'm trying to understand your situation better. Could you describe more of what you're feeling? For instance, how long has it been, and are you having any pain or fever?`;
        }

        session.messages.push({
            sender: 'bot',
            text: botText,
            metadata: {
                ...analysis,
                symptom_detected: symptomFound,
                booking_intent: bookingIntent,
                recommended_doctor: recommendedDoctor
            }
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
