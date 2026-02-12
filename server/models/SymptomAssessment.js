const mongoose = require('mongoose');

const symptomAssessmentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: [{
        name: String,
        severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
        duration: String // e.g., "2 days"
    }],
    risk_score: {
        type: Number, // 0-100 or 1-10 level
        required: true
    },
    risk_level: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    recommendations: [{
        type: String
    }],
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SymptomAssessment', symptomAssessmentSchema);
