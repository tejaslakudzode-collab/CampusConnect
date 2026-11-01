
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },

    description: {
        type: String,
        required: [true, 'Event description is required']
    },

    date: {
        type: Date,
        required: [true, 'Event date is required']
    },

    venue: {
        type: String,
        required: [true, 'Event venue is required']
    },

    posterImage: {
        type: String,
        default: ''
    },

    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    registeredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
