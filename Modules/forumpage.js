const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./userschema');
const app = express();
const questionSchema = require('./QuestionSchema');
const answerSchema = require('./AnswerSchema');
const _ = require("lodash");
const { default: crossOriginEmbedderPolicy } = require('helmet/dist/middlewares/cross-origin-embedder-policy');
mongoose.set('useFindAndModify', false);

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

app.get("/posts/:userId", async (req, res) => {
    const questions = await Questions.find({}).sort({ created_at: -1 });
    const newQuestions = [];
    let currentUserId = req.params.userId;

    for (const question of questions) {
        let x = question.toObject();
        let user = await Users.findById(x.userId);
        if (user != null) {
            x["username"] = user.fullname;
            x["currentUser"] = currentUserId;
            x["isLiked"] = question.LikedUsers.includes(currentUserId);
            x["likes"] = question.LikedUsers.length;
            x["dislikes"] = question.disLikedUsers.length;
            newQuestions.push(x);
        }
    }

    console.log(newQuestions[0]);
    res.status(200).send(newQuestions);
});


app.post('/answers/:icon', async (req, res) => {

    let body = req.body;
    let param = req.params;

    console.table({ body: body });
    console.table({ param: param });

    let filter, update;
    filter = { _id: body.Qid };

    let Question = await Questions.find(filter);
    console.log("-----------------------------------------------------------------------");
    console.log(Question);
    console.log("-----------------------------------------------------------------------");
    let flag = false;
    console.log(Question[0].disLikedUsers.includes(body.userId));
    let x;

    if (param.icon === "likes" && !Question[0].LikedUsers.includes(body.userId)) {
        update = { $push: { LikedUsers: body.userId }, $pull: { disLikedUsers: body.userId } };
        flag = true;
    } else if (param.icon === "dislikes" && !Question[0].disLikedUsers.includes(body.userId)) {
        update = { $pull: { LikedUsers: body.userId }, $push: { disLikedUsers: body.userId } };
        flag = true;
    }
    let r;
    result = await Questions.findOneAndUpdate(filter, update, { new: true });
    r = result.toObject();
    r["likes"] = result.LikedUsers.length;
    r["dislikes"] = result.disLikedUsers.length;
    console.log("Result data");
    console.log(r);

    res.status(200).send(r);

});

module.exports = app;