const express = require('express');
const passport = require('passport');
const router = express.Router();
const accountController = require('../controllers/account.c');

router.route('/')
    .get(accountController.all)      // All accounts

router.route('/:id')
    .get(accountController.get)      // Account details
    .put(accountController.update)      // Account edition
    .delete(accountController.detele)   // Account deletion

module.exports = router;