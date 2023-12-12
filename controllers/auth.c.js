const Account = require('../models/user.m');
const bcrypt = require('bcrypt');
const saltRounds = 17;
const passport = require('passport');

module.exports = {
    loginPage: async(req, res, next)=>{
        try{
            res.send('Login page');
        }catch(error){
            next(error);
        }
    },
    'login': passport.authenticate('myStrategy', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: false
    }),
    'google': passport.authenticate('google', {scope: ['email', 'profile']}),
    'googleCallback': passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }),
    signup: async (req, res, next)=>{
        try{
            const username = req.body.username;
            const password = req.body.password;
            const name = req.body.name;
            const email = req.body.email;
            
            bcrypt.hash(password, saltRounds, async function(err, hash){
                if(err){
                    return next(err);
                }
                const user = new Account(username, hash, name, email, dob);
                await Account.Add(user);
                
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    res.redirect('/');
                });
            })
        }catch(err){
            next(err);
        }
    },
    logout: async(req, res, next)=>{
        req.logout((error)=>{
            if(error) return next(error);
            res.redirect('/');
        });
    }
}