const mongoose = require('mongoose');

const VaultDocumentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    mime_type: {
        type: String,
        required: true
    },
    encrypted_path: {
        type: String
    },
    iv: { // Initialization Vector for encryption
        type: String
    },
    uploaded_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VaultDocument', VaultDocumentSchema);
