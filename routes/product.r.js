const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.c');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .get(productController.all) // All Products
    .post(upload.single('image'), productController.upload) // Product Addition

router.route('/upload')
    .get(productController.uploadPage);

router.route('/update/:id')
    .get(productController.updatePage);

router.route('/:id')
    .get(productController.get) // Product details
    .put(productController.edit) // Product details

module.exports = router;