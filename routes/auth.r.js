const express = require('express');
const passport = require('passport');
const router = express.Router();
const accountController = require('../controllers/auth.c.js');
const userController = require('../controllers/user.c');

router.route('/signup')
    .get(accountController.signupPage)
    .post( accountController.signup);
router.get('/logout', accountController.logout);

// Username-Password strategy
router.route('/login')
    .get(accountController.loginPage)
    .post(accountController.login);

// OAUTH2 strategy
//=Google
router.get('/auth/google', accountController.google);
router.get('/auth/google/callback', accountController.googleCallback);


router.route('/:username')
    .get(userController.updatePage)
    .put(userController.update)

module.exports = router;