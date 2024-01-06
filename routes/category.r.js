const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.c');

router.route('/').get(categoryController.all) // All Categories 
    .post(categoryController.add) // Category creation

router.route('/:id')
    .delete(categoryController.delete) // Category deletion
    .put(categoryController.edit); // Category edition
    //.get(categoryController.get);
module.exports = router;