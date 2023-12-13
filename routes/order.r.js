const express = require('express');
const { route } = require('./category.r');
const router = express.Router();
// const productController = require('../controllers/product.c');

router.route('/')
    .get()      // Order history
    .post()     // Order placement

router.route('/:id')
    .get()      // Order details
    
module.exports = router;