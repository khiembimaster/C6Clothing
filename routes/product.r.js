const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.c');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.route('/')
    .get(productController.all) // All Products
    .post(upload.single('image'), productController.upload) // Product Addition

router.route('/:id')
    .get(productController.get) // Product details
    .delete(productController.delete) // Product deletion
    .put(productController.edit);   // Product edition

module.exports = router;