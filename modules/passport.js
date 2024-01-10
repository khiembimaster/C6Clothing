const passport = require('passport');
const bcrypt = require('bcrypt');
require('dotenv').config('.env');
const Account = require('../models/user.m');
const MyStrategy = require('./myStrategy');
const { as } = require('pg-promise');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    // token = ??
    console.log(user);
    const params = {
        id: user.Email
    }
    fetch('https://localhost:5000/wallet/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(async (res) => {
        const data = await res.json();
        user.refreshToken = data.refreshToken;
        console.log(data);
        done(null, { 'username': user.Username, 'permission': user.permission, wallet: user.refreshToken });
    });
});
passport.deserializeUser(async (user, done) => {
    const u = await Account.Get(user.username);
    if (u) {
        return done(null, u);
    }
    done('invalid', u);
});

//Custom strategy
const myStrategy = new MyStrategy(async (username, password, done) => {
    try {
        const user = await Account.Get(username);
        const rs = await bcrypt.compare(password, user.Password);
        if (rs) {
            return done(null, user);
        }
        done('invalid auth', null);
    } catch (error) {
        done(error);
    }
});
// Google OAuth2 strategy
//Google OAuth2
const google = new GoogleStrategy({
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    clientID: '68992611538-gj9k595vap4saopf7fh32t4euv9t7ea7.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: `https://localhost:${process.env.PORT}/account/auth/google/callback`
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            console.log(profile);
            let user = await Account.Get(profile.displayName + profile.id);
            console.log(user);
            if (user) {
                return done(null, user)
            } else {
                // const pw = await bcrypt.hash(profile._raw, 10);
                bcrypt.hash(profile._raw, 10, async function (err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user = new Account(profile.displayName + profile.id, hash, profile.displayName, profile.emails[0].value);
                    await Account.Add(user);
                    return done(null, user);
                })
            }
        } catch (error) {
            done(error, false);
        }
    }
);

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(myStrategy);
    passport.use(google);
    // passport.use(facebook);
};