const Account = require('../models/user.m');
const bcrypt = require('bcrypt');
const saltRounds = 17;
const passport = require('passport');

module.exports = {
    loginPage: async (req, res, next) => {
        try {
            res.render('signin', {
                css: () => 'css/signin_signup',
                js: () => 'js/empty'
            })
        } catch (error) {
            next(error);
        }
    },
    signupPage: async (req, res, next) => {
        try {
            res.render('signup', {
                css: () => 'css/signin_signup',
                js: () => 'js/empty'
            })
        } catch (error) {
            next(error);
        }
    },
    'login': passport.authenticate('myStrategy', {
        successRedirect: 'back',
        failureRedirect: '/',
        failureFlash: false
    }),
    'google': passport.authenticate('google', { scope: ['email', 'profile'] }),
    'googleCallback': passport.authenticate('google', {
        successRedirect: 'back',
        failureRedirect: '/',
        failureFlash: false
    }),
    signup: async (req, res, next) => {
        try {
            console.log(req.body);
            const username = req.body.username;
            const password = req.body.password;
            const name = req.body.name;
            const email = req.body.email;
            //  console.log(password);
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    return next(err);
                }
                const user = new Account(username, hash, name, email);
                await Account.Add(user);

                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.redirect('back');
                });
            })

        } catch (err) {
            next(err);
        }
    },
    logout: async (req, res, next) => {
        req.logout((error) => {
            if (error) return next(error);
            res.redirect('back');
        });
    }
}