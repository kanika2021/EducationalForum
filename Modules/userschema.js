const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        pattern: '.*com'
    },
    password: {
        type: String,
        min: 3,
        max: 40
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    roles: {
        type: String,
        enum: ['admin', 'Teacher', 'Student', "Alumini"],
        required: true
    },
    username: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    created_at: {
        type: Date, default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});


module.exports = userSchema;