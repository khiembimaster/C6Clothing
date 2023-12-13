const express = require('express');
const { route } = require('./category.r');
const router = express.Router();
// const productController = require('../controllers/product.c');

router.route('/')
    .get()      // Cart Management  
    .post('/items', ); // Cart Item Addition 

router.route('/items/:itemId')
    .put()      // Cart Item Update
    .delete()   // Cart Item Deletion
    
module.exports = router;