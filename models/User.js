const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    source: {
        type: String,
        default: 'uber',
        enum: ['uber', 'google']
    }
});

module.exports = mongoose.model('User', UserSchema);
