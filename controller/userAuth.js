const passport = require('passport')
const userAuth = {
    googleAuth: () => {
        console.log("calling ")
        let GoogleStrategy = require('passport-google-oauth20').Strategy;

        passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:3000/auth/google/callback",
                passReqToCallback: true,
                scope: [
                    'openid',
                    'profile',
                    'email',
                ],
                prompt: 'consent',
            },
            function (accessToken, refreshToken, profile, cb) {
                // @todo if we want to store the created user or loggedIn user into database then we have to write the configuration here
                return cb(null, profile)
            }
        ));
    },
    callback: () => {
        passport.authenticate('google', {failureRedirect: 'http://localhost:3000/login'}),
            function (req, res) {
                // Successful authentication, redirect home.
                res.redirect('http://localhost:3000/');
            };
    }

}
module.exports = userAuth
