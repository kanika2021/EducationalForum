const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        enum: ["General", "Science", "maths", "Engineering", "Commerce", "Medical", "Industry", "Business", "Technology"],
        required: true
    },
    Question: {
        type: String,
        required: true
    },
    Description: {
        type: String
    },
    Likes: {
        type: Number,
        default: 0
    },
    LikedUsers: {
        type: Array
    },
    dislikes: {
        type: Number,
        default: 0
    },
    disLikedUsers: {
        type: Array
    },
    created_at: {
        type: Date, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }

});

module.exports = QuestionSchema;