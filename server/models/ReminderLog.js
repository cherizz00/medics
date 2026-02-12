const mongoose = require('mongoose');

const reminderLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String, // e.g., "Paracetamol", "Drink Water"
        required: true
    },
    type: {
        type: String,
        enum: ['medication', 'water', 'appointment', 'other'],
        required: true
    },
    scheduled_time: {
        type: Date,
        required: true
    },
    taken_time: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'taken', 'skipped'],
        default: 'pending'
    },
    dosage: {
        type: String // e.g., "500mg", "1 glass"
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ReminderLog', reminderLogSchema);
