const express = require('express');
const passport = require('passport');
const router = express.Router();
const AccountController = require('../controllers/auth.c.js');


router.post('/signup', AccountController.signup);

router.get('/logout', AccountController.logout);
// Username-Password strategy
router.route('/login')
    .get(AccountController.loginPage)
    .post(AccountController.login);

// OAUTH2 strategy
//=Google
router.get('/auth/google', AccountController.google);
router.get('/auth/google/callback', AccountController.googleCallback);



module.exports = router;