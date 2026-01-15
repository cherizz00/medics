const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    category: { type: String, default: 'General' },
    size: { type: String, default: '0.0 MB' },
    uploadedAt: { type: Date, default: Date.now }

});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
