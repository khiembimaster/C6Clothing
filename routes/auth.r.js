const express = require('express');
const passport = require('passport');
const router = express.Router();
const accountController = require('../controllers/auth.c.js');


router.post('/signup', accountController.signup);
router.get('/logout', accountController.logout);

// Username-Password strategy
router.route('/login')
    .get(accountController.loginPage)
    .post(accountController.login);

// OAUTH2 strategy
//=Google
router.get('/auth/google', accountController.google);
router.get('/auth/google/callback', accountController.googleCallback);

module.exports = router;