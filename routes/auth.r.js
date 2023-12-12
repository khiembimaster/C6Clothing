const express = require('express');
const passport = require('passport');
const router = express.Router();
const Account = require('../models/user.m');
    
router.post('/signup', async (req, res, next)=>{
  try{
      const username = req.body.username;
      const password = req.body.password;
      const name = req.body.name;
      const email = req.body.email;
      const dob = req.body.dateofbirth;   
      
      bcrypt.hash(password, saltRounds, async function(err, hash){
          if(err){
              return next(err);
          }
          const user = new Account(username, hash, name, email, dob);
          await accountModel.Add(user);
          
          req.login(user, function(err) {
              if (err) { return next(err); }
              res.redirect('/');
          });
      })
  }catch(err){
      next(err);
  }
});

router.get('/logout', (req, res, next)=>{
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});
// Username-Password strategy
router.get('/login',);
router.post('/login', );

// OAUTH2 strategy
//=Google
router.get('/auth/google', 
  passport.authenticate('google', {scope: ['email', 'profile']}));
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

// app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: '/home',
//     failureRedirect: '/login'
//   })
// );



module.exports = router;