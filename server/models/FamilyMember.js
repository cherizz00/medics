const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
    primary_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    relation: {
        type: String,
        enum: ['self', 'father', 'mother', 'spouse', 'child', 'other'],
        default: 'other'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    avatar_url: {
        type: String
    },
    blood_group: {
        type: String
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    linked_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
