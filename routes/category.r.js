const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.c');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.route('/upload').get(categoryController.upload);

router.route('/').get(categoryController.all) // All Categories 
    .post(upload.single('image'), categoryController.add) // Category creation

router.route('/:id')
    .delete(categoryController.delete) // Category deletion
    .put(categoryController.edit); // Category edition
    //.get(categoryController.get);
module.exports = router;