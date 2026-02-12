const mongoose = require('mongoose');

const HeartRateLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bpm: {
        type: Number,
        required: true
    },
    confidence: {
        type: Number, // 0-100 score of signal quality
        default: 0
    },
    raw_data: {
        type: [Number], // Optional: Store snippet of PPG data if premium
        select: false    // Don't return by default
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HeartRateLog', HeartRateLogSchema);
