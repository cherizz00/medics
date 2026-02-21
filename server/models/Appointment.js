const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor_name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    token_id: {
        type: String,
        required: true,
        unique: true
    },
    appointment_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
