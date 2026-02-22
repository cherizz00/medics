const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
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
        height: Number,
        weight: Number,
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
    vaultPin: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
