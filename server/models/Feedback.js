const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['bug', 'feature_request', 'general'],
        default: 'general'
    },
    message: {
        type: String,
        required: true
    },
    rating: {
        type: Number, // 1-5
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['new', 'reviewed', 'resolved'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
