const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./userschema');
const app = express();
const questionSchema = require('./QuestionSchema');
const answerSchema = require('./AnswerSchema');
const _ = require("lodash");
var md5 = require('md5');
const bcrypt = require('bcrypt');
const { func } = require('joi');
mongoose.set('useFindAndModify', false);
const saltRounds = 10;

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
            res.render('Forum/Forum', { name: user.username, userId: user._id, token: user.token, nav: "home" });
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
        try {
            let x = question.toObject();
            let user = await Users.findById(x.userId);
            if (user != null) {
                x["username"] = user.fullname;
                x["currentUser"] = currentUserId;
                x["isLiked"] = question.LikedUsers.includes(currentUserId);
                x["isDisliked"] = question.disLikedUsers.includes(currentUserId);
                x["likes"] = question.LikedUsers.length;
                x["dislikes"] = question.disLikedUsers.length;
                x["isCommented"] = question.CommentedUsers.includes(currentUserId);
                x["isBookmarked"] = question.BookmarkedUsers.includes(currentUserId);
                newQuestions.push(x);
            }
        } catch (e) {
            console.info(e);
        };
    }

    console.log("Post data:");
    console.log(newQuestions[3]);
    res.status(200).send(newQuestions);
});

app.get("/allanswers", async (req, res) => {
    console.log(req.query.Qid);
    let questionId = req.query.Qid;
    const answers = await Answers.find({ QuestionId: questionId }).exec();
    if (answers != null)
        res.status(200).send(answers);
})

app.post("/myanswers/", async (req, res) => {
    let body = req.body;
    console.log(body);
    const user = await Users.findById(body.userId);
    let filter = { QuestionId: req.body.questionId };
    let update = { $addToSet: { answers: { userId: user.username, answer: body.answers } } };
    let update1 = { $push: { CommentedUsers: body.userId } };

    const question = await Questions.findByIdAndUpdate(body.questionId, update1, { new: true });
    const answers = await Answers.findOneAndUpdate(filter, update, { new: true, upsert: true });
    let results;
    // console.log(question);
    results = answers.toObject();
    results["IsCurrentUserCommented"] = question.CommentedUsers.includes(body.userId);
    // console.log("result of my answer");
    // console.log(results);
    res.status(200).send(results);
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
    console.log("----------------------------------------------------------------------");
    let flag = false;
    console.log(Question[0].disLikedUsers.includes(body.userId));

    if (param.icon === "likes" && !Question[0].LikedUsers.includes(body.userId)) {
        update = { $push: { LikedUsers: body.userId }, $pull: { disLikedUsers: body.userId } };
        flag = true;
    } else if (param.icon === "dislikes" && !Question[0].disLikedUsers.includes(body.userId)) {
        update = { $pull: { LikedUsers: body.userId }, $push: { disLikedUsers: body.userId } };
        flag = true;
    } else {
        if (Question[0].BookmarkedUsers.includes(body.userId)) {
            update = { $pull: { BookmarkedUsers: body.userId } };
            flag = false;
        }
        else {
            update = { $push: { BookmarkedUsers: body.userId } };
            flag = true;
        }
    }
    let r;
    let result = await Questions.findOneAndUpdate(filter, update, { new: true });
    r = result.toObject();
    r["likes"] = result.LikedUsers.length;
    r["dislikes"] = result.disLikedUsers.length;
    r["isBookmarked"] = result.BookmarkedUsers.includes(body.userId);
    console.log("Result data");
    console.log(r);
    res.status(200).send(r);
});


app.get('/myforum', async (req, res) => {
    console.log("inside forumpage");
    let token = req.query.token;

    console.log("token : " + token);
    Users.findOne({ "token": token }, async (err, user) => {
        console.log(user);
        if (err) {
            res.status(500).send(err);
        }
        if (user == null) {
            res.redirect("/login");
        } else {
            const myQuestions = await Questions.find({ userId: user._id });
            console.log(myQuestions);
            res.render('Forum/MyForum', { name: user.username, userId: user._id, token: user.token, nav: "myforum", myQuestions: myQuestions });
        }
    });
})

app.get('/profile', async (req, res) => {
    console.log("inside profile");
    let token = req.query.token;

    console.log("token : " + token);
    Users.findOne({ "token": token }, async (err, user) => {
        console.log(user);
        if (err) {
            res.status(500).send(err);
        }
        if (user == null) {
            res.redirect("/login");
        } else {
            res.render('Forum/MyProfile', { name: user.username, userId: user._id, token: user.token, data: user, nav: "profile" });
        }
    });
});

app.get('/getUserAnswer', async (req, res) => {
    const qid = req.query.qid;
    const answers = await Answers.find({ QuestionId: qid });
    res.status(200).send(answers);
});

app.put("/updateProfile", async (req, res) => {
    console.log("update profile");
    console.log(req.body);
    let body = req.body;
    let filter = { _id: body.userId };
    let user = {};

    if (body.action === "editProfile") {
        let update = { fullname: body.fullname, dateOfBirth: body.birthDate, question: body.question, answer: body.answer, roles: body.role, username: body.username, college: body.college };
        user = await Users.findOneAndUpdate(filter, update, { new: true });
        res.status(200).send(user);
    } else {
        Users.findOne(filter, async (err, docs) => {
            console.log("user found");
            console.log(docs);
            console.log("err: " + err);
            if (!err) {
                bcrypt.compare(body.oldPass, docs.password, async (error, result) => {
                    console.log(error);
                    console.log("changed password");
                    console.log(result);

                    if (result) {
                        bcrypt.hash(body.newPass, saltRounds, async (err, hash) => {
                            console.log("hashed password");
                            console.log(hash);
                            try {
                                if (!err) {
                                    Users.findOneAndUpdate(filter, { password: hash, token: md5(result.email + body.oldPass) }, { new: true }, function (err, docs) {
                                        if (err)
                                            console.log(err);
                                        console.log(docs);
                                        res.status(200).send("new password saved successfully");
                                    });
                                }
                            }
                            catch (e) {
                                console.error(e);
                            }
                        });
                    }
                    else {
                        res.status(500).send("Incorrect Old Password");
                    }
                });
            }
        });
    }
});

app.get("/mybookmarks", async (req, res) => {
    console.log("inside profile");
    let token = req.query.token;

    console.log("token : " + token);
    Users.findOne({ "token": token }, async (err, user) => {
        console.log(user);
        let x = String(user._id);
        if (err) {
            res.status(500).send(err);
        }
        if (user == null) {
            res.redirect("/login");
        } else {
            const quest = await Questions.find({ BookmarkedUsers: { $in: [x] } });
            console.log(quest);
            res.render('Forum/MyBookmark', { name: user.username, userId: user._id, token: user.token, myQuestions: quest, nav: "bookmarks" });
        }
    });
});

app.get("/mycredits", async (req, res) => {
    console.log("inside profile");
    let token = req.query.token;

    console.log("token : " + token);
    Users.findOne({ "token": token }, async (err, user) => {
        console.log(user);
        let x = String(user._id);
        if (err) {
            res.status(500).send(err);
        }
        if (user == null) {
            res.redirect("/login");
        } else {
            const likes = await Questions.find({ LikedUsers: { $in: [x] } });
            const posts = await Questions.find({ userId: user._id });
            const comments = await Questions.find({ CommentedUsers: { $in: [x] } });

            let d = new Date(new Date(likes[0].created_at).getTime()).toDateString().split(" ");
            console.log(d);

            let c1 = { "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0, "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0 };
            let c2 = { "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0, "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0 };
            let c3 = { "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0, "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0 };

            likes.forEach(user => {
                try {
                    let date = new Date(new Date(user.created_at).getTime()).toDateString().split(" ");
                    // console.log({ isCurrentYeat: user[date[3]] === new Date().getFullYear(), x: date[3], date: date });
                    if (date[3] == new Date().getFullYear()) {
                        c1[date[1]] = c1[date[1]] + 1;
                    }
                } catch (e) { console.log(e); }
            });
            posts.forEach(user => {
                try {
                    let date = new Date(new Date(user.created_at).getTime()).toDateString().split(" ");
                    // console.log({ isCurrentYeat: user[date[3]] === new Date().getFullYear(), x: date[3], date: date });
                    if (date[3] == new Date().getFullYear()) {
                        c2[date[1]] = c2[date[1]] + 1;
                    }
                } catch (e) { console.log(e); }
            });
            comments.forEach(user => {
                try {
                    let date = new Date(new Date(user.created_at).getTime()).toDateString().split(" ");
                    // console.log({ isCurrentYeat: user[date[3]] === new Date().getFullYear(), x: date[3], date: date });
                    if (date[3] == new Date().getFullYear()) {
                        c3[date[1]] = c2[date[1]] + 1;
                    }
                } catch (e) { console.log(e); }
            });

            let x1 = [];
            let x2 = [];
            let x3 = [];

            let counter = 0;

            for (const i in c1) {
                counter += c1[i];
                x1.push(c1[i]);
            }

            for (const i in c2) {
                counter += c2[i];
                x2.push(c2[i]);
            }

            for (const i in c3) {
                counter += c3[i];
                x3.push(c3[i]);
            }

            res.render('Forum/MyCredits',
                {
                    name: user.username,
                    userId: user._id,
                    token: user.token,
                    nav: "credits",
                    likes: x1,
                    posts: x2,
                    comments: x3,
                    counter: counter
                });
        }
    });
});


app.post("/search", async (req, res) => {
    console.log(req.body);
    let questions = await Questions.find({ Question: { $regex: req.body.input } });
    console.log(questions);
    let newQuestions = [];
    for (const question of questions) {
        try {
            let x = question.toObject();
            let user = await Users.findById(x.userId);
            if (user != null) {
                x["username"] = user.fullname;
                newQuestions.push(x);
            }
        } catch (e) {
            console.info(e);
        };
    }
    if (newQuestions != null)
        res.status(200).send(newQuestions);
})

app.delete("/deleteanswer", async (req, res) => {
    let qid = req.query.qid;
    console.log(qid);
    let q = await Questions.findOneAndDelete({ _id: qid });
    if (q != null)
        res.status(200).send("success");
});



module.exports = app;