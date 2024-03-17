var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const userAuth = require('./controller/userAuth')

var app = express();
require ('./auth');
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')))
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
const session = require ('express-session');



function isLoggedIn (req, res, next) {
    req.user ? next () : res.sendStatus (401);
}

app.get ('/', (req, res) => {
    res.sendFile ('index.html');
});

app.use (
    session ({
        secret: 'mysecret',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false},
    })
);

app.use (passport.initialize ());
app.use (passport.session ());
app.get (
    '/auth/google',
    passport.authenticate ('google', {
        scope: ['email', 'profile'],
    })
);

app.get (
    '/auth/google/callback',
    passport.authenticate ('google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure',
    })
);

app.get ('/auth/google/failure', (req, res) => {
    res.send ('Something went wrong!');
});

app.get ('/auth/protected', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    res.send (`Hello ${name}`);
});

app.use ('/auth/logout', (req, res) => {
    req.session.destroy ();
    res.send ('See you again!');
});


// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.get('/auth/google', userAuth.googleAuth)

module.exports = app;
