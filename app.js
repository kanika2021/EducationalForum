const express = require('express');
const ejsLint = require('ejs-lint');
const Joi = require('joi');
const mongoose = require('mongoose');
const helmet = require('helmet');
const ejs = require('ejs');
const morgan = require('morgan');
const path = require('path');
const userAuth = require('./Modules/UserAuthendication');
const bodyParser = require('body-parser');
const userSchema = require('./Modules/userschema');
const forumPage = require('./Modules/forumpage')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost:27017/eduforum', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("Connected to Mongo database"))
    .catch(err => console.log(err));


mongoose.set('useCreateIndex', true);

app.use('/', userAuth)
app.use('/', forumPage)

const PORT = process.env.NODE_ENV || 3000;
app.listen(PORT, () => console.log(`Listening to the port ${PORT}`));