const express = require('express');
const passport = require('passport');
const router = express.Router();
const accountController = require('../controllers/auth.c.js');

router.route('/')
    .get()      // All accounts

router.route('/:id')
    .get()      // Account details
    .put()      // Account edition
    .delete()   // Account deletion

module.exports = router;