const express = require('express');
const homeController = require('../controllers/home.c');
const router = express.Router();

router.get('/', homeController.homePage);

module.exports = router;