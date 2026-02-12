const mongoose = require('mongoose');

const HealthBotSessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    started_at: {
        type: Date,
        default: Date.now
    },
    last_updated: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'escalated'],
        default: 'active'
    },
    risk_score: {
        type: Number,
        default: 0
    },
    messages: [{
        sender: {
            type: String,
            enum: ['user', 'bot'],
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        metadata: {
            type: Object // For storing risk factors detected in this specific message
        }
    }]
});

module.exports = mongoose.model('HealthBotSession', HealthBotSessionSchema);
