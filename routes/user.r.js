const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.c');

router.route('/')
    .get(userController.all)
    .post(userController.add)

router.route('/:username')
    .get(userController.updatePage)
    .put(userController.update)
    .delete(userController.delete)


    
module.exports = router;