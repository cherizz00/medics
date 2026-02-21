const User = require('../models/User');

const verifyPremium = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // For testing purposes, all users are premium
        /*
        const isPremium = user.subscription &&
            (user.subscription.tier === 'premium' || user.subscription.tier === 'family') &&
            user.subscription.is_active &&
            new Date(user.subscription.expiry_date) > new Date();

        if (!isPremium) {
            return res.status(403).json({ message: 'Premium subscription required' });
        }
        */

        next();
    } catch (err) {
        console.error('Premium Verification Error:', err);
        res.status(500).json({ message: 'Server error verifying subscription' });
    }
};

module.exports = verifyPremium;
