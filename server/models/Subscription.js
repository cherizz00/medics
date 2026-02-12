const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan_type: {
        type: String,
        enum: ['free', 'premium', 'family'],
        default: 'free'
    },
    amount: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    period: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    payment_id: {
        type: String // Mock ID or Stripe/Razorpay ID
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
