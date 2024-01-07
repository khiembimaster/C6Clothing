const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('../controllers/admin.c');

router.route('/')
    .get(adminController.dashboard)      // All accounts


    module.exports = router;