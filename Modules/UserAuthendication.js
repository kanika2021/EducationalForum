const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./userschema');
var md5 = require('md5');
const bcrypt = require('bcrypt');
const forumPage = require('./forumpage')
const saltRounds = 10;

const app = express();
app.use('/', forumPage);

const Users = mongoose.model('Users', userSchema);

app.get('/register', (req, res) => {
    res.render('Register/Register');
});

app.post('/register', (req, res) => {
    console.log(req.body);
    Users.findOne({ "email": req.body.email }, (err, user) => {
        if (err) {
            res.status(500).send(err);
        }
        if (user == null) {
            bcrypt.hash(req.body.newPassword, saltRounds, function (err, hash) {
                if (err) {
                    console.log("error in mongoose");
                    console.log(err);
                }
                else {

                    let x = req.body.birthDate.split("-");
                    const dateOfBirth = new Date(x[2], x[1] - 1, x[0]).getTime();
                    const token = md5(req.body.email);
                    const user = new Users({
                        fullname: req.body.username,
                        email: req.body.email,
                        password: hash,
                        question: req.body.question,
                        answer: req.body.answer,
                        college: req.body.college,
                        dateOfBirth: dateOfBirth,
                        roles: req.body.role,
                        username: req.body.username,
                        token: token
                    });

                    user.save().then((result) => {
                        Users.findOne({ "email": result.email }, function (err, user) {
                            if (err)
                                res.status(500).send(err);
                            res.status(200).send(user);
                        });
                    }).catch((err) => {
                        res.status(500).send(err);
                    });
                }

            });

        }
        else {
            res.status(500).send("Given user is already registered");
        }
    })
});

app.get('/login', (req, res) => {
    console.log(req.query);
    res.render('login/login');
})

app.post('/login', (req, res) => {
    console.log("request");
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({ email: email }, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            bcrypt.compare(password, foundUser.password, function (err, result) {
                if (result == true) {
                    res.status(200).send(foundUser);
                }
                else {
                    res.send("incorrect id or password");
                }
            });
        }
    })
})

module.exports = app;