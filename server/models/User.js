const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false // Made optional for future OTP/Social login
    },
    auth_provider: {
        type: String,
        enum: ['password', 'google', 'mobile'],
        default: 'password'
    },
    profile: {
        dob: Date,
        gender: { type: String, enum: ['male', 'female', 'other'] },
        blood_group: String,
        height: Number, // in cm
        weight: Number, // in kg
        avatar_url: String
    },
    subscription: {
        tier: { type: String, enum: ['free', 'premium', 'family'], default: 'free' },
        expiry_date: Date,
        is_active: { type: Boolean, default: false }
    },
    settings: {
        notifications: { type: Boolean, default: true },
        language: { type: String, default: 'en' },
        theme: { type: String, default: 'light' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
