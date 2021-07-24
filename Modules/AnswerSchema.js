const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    QuestionId: {
        type: String,
        required: true
    },
    answer: {
        type: Array,
        required: true
    }
})

module.exports = answerSchema;