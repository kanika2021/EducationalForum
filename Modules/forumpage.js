const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./userschema');
const app = express();
const questionSchema = require('./QuestionSchema');
const answerSchema = require('./AnswerSchema');

const Users = mongoose.model('Users', userSchema);
const Questions = mongoose.model('Questions', questionSchema);
const Answers = mongoose.model('Answers', answerSchema);

app.get('/forumpage', (req, res) => {
    console.log("inside forumpage");

    let token = req.query.token;
    console.log("token : " + token);
    Users.findOne({ "token": token }, (err, user) => {
        console.log(user);
        if (err) {
            res.status(500).send(err);
        }
        if (user == null) {
            res.redirect("/login");
        } else
            res.render('Forum/Forum', { name: user.username, userId: user._id });
    });

})

app.post('/compose', (req, res) => {
    const data = req.body;
    console.log(data);
    const Question = new Questions({
        userId: req.body.userId,
        tag: req.body.tag,
        Question: req.body.question,
        Description: req.body.describe
    });

    Question.save()
        .then((result) => res.status(200).send(result))
        .catch((err) => {
            console.log(err);
            res.status(500).send(err)
        });
})

app.get("/posts", async (req, res) => {
    const questions = await Questions.find({}).sort({ created_at: -1 });
    const newQuestions = [];

    for (const question of questions) {
        let x = question.toObject();
        let user = await Users.findById(x.userId);
        if (user != null) {
            x["username"] = user.fullname;
            newQuestions.push(x);
        }
    }

    console.log(newQuestions[0]);
    res.status(200).send(newQuestions);
});


app.post('/answers/:icon', async (req, res) => {
    let pathparam = req.params;
    let bodyval = req.body;
    let flag = req.body.flag;
    // console.log(pathparam);
    console.log(bodyval);
    let filter = { _id: bodyval.Qid };
    let Question = await Questions.findById(filter);
    console.log(Question);
    let update;
    if (!flag)
        update = { Likes: (Question.Likes + 1), LikedUsers: Questions.LikedUsers.push(userId) };
    else if (flag)
        update = { Likes: (Question.Likes - 1), LikedUsers: Questions.LikedUsers.push(userId) };
    console.log(update);
    let finalresult = await Questions.findOneAndUpdate(filter, update, { new: true });
    if (finalresult != null)
        res.status(200).send(finalresult);
});

module.exports = app;

