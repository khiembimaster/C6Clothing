const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.c');
const checkAuthenticated = require('../modules/checkAuthenticated');
const isAdmin = require('../modules/checkAdmin');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.route('/upload')
    .get(checkAuthenticated, isAdmin, categoryController.upload);
router.route('/update/:id')
    .get(checkAuthenticated, isAdmin, categoryController.update);

router.route('/')
    .get(categoryController.all) // All Categories 
    .post(checkAuthenticated, isAdmin, upload.single('image'), categoryController.add) // Category creation

router.route('/:id')
    .delete(checkAuthenticated, isAdmin, categoryController.delete) // Category deletion
    .put(checkAuthenticated, isAdmin, categoryController.edit) // Category edition
    .get(categoryController.get);
module.exports = router;