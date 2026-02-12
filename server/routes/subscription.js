const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// @route   POST api/subscription/create
// @desc    Upgrade to premium (Mock Payment)
router.post('/create', auth, async (req, res) => {
    try {
        const { plan_type, period } = req.body; // plan_type: 'premium', period: 'monthly'/'yearly'

        // Mock Payment Verification (In reality, verify Stripe/Razorpay signature here)
        const payment_id = 'mock_pay_' + Date.now();
        const amount = period === 'yearly' ? 999 : 99;

        // Calculate end date
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (period === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        // Create Subscription Record
        const newSubscription = new Subscription({
            user_id: req.user.id,
            plan_type,
            amount,
            period,
            start_date: startDate,
            end_date: endDate,
            status: 'active',
            payment_id
        });

        await newSubscription.save();

        const updatedUser = await User.findById(req.user.id).select('-password');

        res.json({
            message: 'Subscription activated successfully',
            subscription: newSubscription,
            user: updatedUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error processing subscription' });
    }
});

// @route   GET api/subscription/status
// @desc    Get current subscription details
router.get('/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('subscription');
        const activeSub = await Subscription.findOne({
            user_id: req.user.id,
            status: 'active',
            end_date: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        res.json({
            tier: user.subscription.tier,
            isActive: user.subscription.is_active && new Date(user.subscription.expiry_date) > new Date(),
            expiry: user.subscription.expiry_date,
            details: activeSub
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching subscription status' });
    }
});

module.exports = router;
