const express = require('express');
//const { route } = require('./category.r');
const router = express.Router();
const cartController = require('../controllers/cart.c');
const cartItemsController = require('../controllers/cartItems.c')
const checkAuthenticated = require('../modules/checkAuthenticated')
router.route('/')
    .get(cartController.cartPage)  
    .post(cartController.add)


router.route('/items/:id')
    .put(cartItemsController.update)      // Cart Item Update
    .delete(cartItemsController.delete)   // Cart Item Deletion
    .get(cartController.getByID)

// router.route('/:id')
//     .put(cartController.update)
//     .delete(cartController.delete)
    // .get(cartController.cartPage)


router.route('/items')
    .post(checkAuthenticated, cartItemsController.add)// Cart ItemAd dition 
    .get(cartItemsController.getAll)

    module.exports = router;