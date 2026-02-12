const mongoose = require('mongoose');

const vitalLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    family_member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember'
    },
    type: {
        type: String,
        enum: ['heart_rate', 'bp', 'glucose', 'weight', 'temperature', 'spo2', 'bmi'],
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can be a number or object like { systolic: 120, diastolic: 80 }
        required: true
    },
    unit: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    source: {
        type: String,
        enum: ['manual', 'camera', 'device'],
        default: 'manual'
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VitalLog', vitalLogSchema);
