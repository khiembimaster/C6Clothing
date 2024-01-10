const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('../controllers/admin.c');
const productControler = require('../controllers/product.c');
const categoryControler = require('../controllers/category.c');

const isAuthenticated = require('../modules/checkAuthenticated');
const isAdmin = require('../modules/checkAdmin');


router.route('/signin')
    .get(adminController.signinPage)
    .post(adminController.login)

router.route('/')
    .get(isAuthenticated, isAdmin, adminController.dashboard)      // All accounts

router.route('/category')
    .get(isAuthenticated, isAdmin, adminController.category)
router.route('/category/upload')
    .get(isAuthenticated, isAdmin, adminController.uploadCategory)
router.route('/category/:id')
    .delete(isAuthenticated, isAdmin, categoryControler.delete)

router.route('/product')
    .get(isAuthenticated, isAdmin, adminController.product)
router.route('/product/upload')
    .get(isAuthenticated, isAdmin, adminController.uploadProduct)
router.route('/product/:id')
    .delete(isAuthenticated, isAdmin, productControler.delete)

router.route('/user/update/:username')
    .get(isAuthenticated, isAdmin, adminController.userUpdate)
router.route('/user/add')
    .get(isAuthenticated, isAdmin, adminController.addUser)
router.route('/user')
    .get(isAuthenticated, isAdmin, adminController.user)

module.exports = router;