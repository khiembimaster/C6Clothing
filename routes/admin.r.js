const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('../controllers/admin.c');
const productControler = require('../controllers/product.c')
router.route('/')
    .get(adminController.dashboard)      // All accounts
router.route('/category')
    .get(adminController.category)  
router.route('/category/upload')
    .get(adminController.uploadCategory)  
router.route('/product')
    .get(adminController.product)  
router.route('/product/upload')
    .get(productControler.uploadPage)  
router.route('/product/:id')
    .delete(productControler.delete)

module.exports = router;