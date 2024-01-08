const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('../controllers/admin.c');
const productControler = require('../controllers/product.c')
const categoryController = require('../controllers/category.c');
router.route('/')
    .get(adminController.dashboard)      // All accounts

//Category
router.route('/category')
    .get(adminController.category)  
router.route('/category/upload')
    .get(categoryController.upload)
router.route('/category/:id')
    .delete(categoryController.delete)

//Product
router.route('/product')
    .get(adminController.product)  
router.route('/product/upload')
    .get(productControler.uploadPage)  
router.route('/product/:id')
    .delete(productControler.delete)

module.exports = router;