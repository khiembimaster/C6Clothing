const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('../controllers/admin.c');
const productControler = require('../controllers/product.c');
const categoryControler = require('../controllers/category.c');

router.route('/')
    .get(adminController.dashboard)      // All accounts

router.route('/category')
    .get(adminController.category)
router.route('/category/upload')
    .get(adminController.uploadCategory)
router.route('/category/update/:id')
    .get(adminController.updateCategory)
    .put(categoryControler.edit)
router.route('/category/:id')
    .delete(categoryControler.delete)

router.route('/product')
    .get(adminController.product)
router.route('/product/upload')
    .get(adminController.uploadProduct)
router.route('/product/update/:id')
    .get(adminController.updateProduct)
    .put(productControler.edit)
router.route('/product/:id')
    .delete(productControler.delete)

router.route('/user')
    .get(adminController.user)
module.exports = router;