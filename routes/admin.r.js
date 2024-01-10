const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('../controllers/admin.c');
const productControler = require('../controllers/product.c');
const categoryControler = require('../controllers/category.c');


router.route('/signin')
    .get(adminController.signinPage)
    .post(adminController.login)

router.route('/')
    .get(adminController.dashboard)      // All accounts

router.route('/category')
    .get(adminController.category)
router.route('/category/upload')
    .get(adminController.uploadCategory)
router.route('/category/:id')
    .delete(categoryControler.delete)

router.route('/product')
    .get(adminController.product)
router.route('/product/upload')
    .get(adminController.uploadProduct)
router.route('/product/:id')
    .delete(productControler.delete)

router.route('/user/update/:username')
    .get(adminController.userUpdate)
router.route('/user')
    .get(adminController.user)

module.exports = router;