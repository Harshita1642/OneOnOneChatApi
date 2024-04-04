const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    SUID: {
        type: String,
        required: true
    },
    RUID: {
        type: String,
        required: true
    },
    From: {
        type: String,
        required: true
    },
    To: {
        type: String,
        required: true
    },
    Message: {
        type: String,
        required: true
    },
    Delivered:{
        type: Boolean,
        default: false
    },
    Read:{
        type: Boolean,
        default: false
    }
});

module.exports = messageSchema;