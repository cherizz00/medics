const mongoose = require('mongoose');

const educationalContentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['stories', 'articles', 'tips'],
        required: true,
        default: 'stories'
    },
    content_url: {
        type: String, // Image/Video URL for stories
        required: true
    },
    description: {
        type: String // Text content or caption
    },
    tags: [{
        type: String
    }],
    is_premium: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EducationalContent', educationalContentSchema);
