const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    family_member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['prescription', 'lab_report', 'vaccine', 'invoice', 'scan', 'other'],
        required: true
    },
    file_url: {
        type: String,
        required: true
    },
    record_date: {
        type: Date,
        default: Date.now
    },
    doctor_name: {
        type: String
    },
    tags: [{
        type: String
    }],
    ocr_data: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Record', recordSchema);
