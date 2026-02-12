const mongoose = require('mongoose');

const InsuranceInsightSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    policy_number: {
        type: String,
        required: false
    },
    provider: {
        type: String,
        default: 'Unknown Provider'
    },
    coverage_limit: {
        type: Number,
        default: 0
    },
    premium_amount: {
        type: Number,
        default: 0
    },
    expiry_date: {
        type: Date
    },
    covered_items: [String],
    not_covered_items: [String],
    gaps: [String],
    uploaded_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InsuranceInsight', InsuranceInsightSchema);
