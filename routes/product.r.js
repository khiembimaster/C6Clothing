const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.c');
const checkAuthenticated = require('../modules/checkAuthenticated');
const isAdmin = require('../modules/checkAdmin');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .get(productController.all) // All Products
    .post(checkAuthenticated, isAdmin, upload.single('image'), productController.upload) // Product Addition

router.route('/upload')
    .get(checkAuthenticated, isAdmin, productController.uploadPage);

router.route('/update/:id')
    .get(checkAuthenticated, isAdmin, productController.updatePage);

router.route('/:id')
    .get(productController.get) // Product details
    .put(checkAuthenticated, isAdmin, productController.edit) // Product details

module.exports = router;