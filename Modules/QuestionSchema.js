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
    LikedUsers: {
        type: Array,
        validator: function (v) {
            return !this.LikedUsers.includes(v);
        }
    },
    disLikedUsers: {
        type: Array
    },
    CommentedUsers: {
        type: Array,
        unique: true
    },
    BookmarkedUsers: {
        type: Array,
        unique: true
    },
    created_at: {
        type: Date, default: Date.now
    },
    updated_at: {
        type: Date, default: Date.now
    }

});

module.exports = QuestionSchema;