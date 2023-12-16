const express = require('express');
//const { route } = require('./category.r');
const router = express.Router();
const cartController = require('../controllers/cart.c');
const cartItemsController = require('../controllers/cartItems.c')
router.route('/')
    .get(cartController.all)      // Cart Management  
    .post(cartController.add)
router.route('/:id')
    .put(cartController.update)
    .delete(cartController.delete)
    .get(cartController.getByID)
router.route('/items')
    .post(cartItemsController.add)// Cart Item Addition 
    .get(cartItemsController.getAll)
router.route('/items/:id')
    .put(cartItemsController.update)      // Cart Item Update
    .delete(cartItemsController.delete)   // Cart Item Deletion
    .get(cartController.getByID)
module.exports = router;