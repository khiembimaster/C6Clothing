const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.c');
const checkAuthenticated = require('../modules/checkAuthenticated');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .get(productController.all) // All Products
    .post(checkAuthenticated, upload.single('image'), productController.upload) // Product Addition

router.route('/upload')
    .get(checkAuthenticated, productController.uploadPage);

router.route('/update/:id')
    .get(checkAuthenticated, productController.updatePage);

router.route('/:id')
    .get(productController.get) // Product details
    .put(checkAuthenticated, productController.edit) // Product details

module.exports = router;