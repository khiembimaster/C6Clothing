const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.c');
const checkAuthenticated = require('../modules/checkAuthenticated');
const isAdmin = require('../modules/checkAdmin');
router.route('/')
    .get(userController.all)
    .post(userController.add)

router.route('/:username')
    .get(userController.updatePage)
    .put(userController.update)
    .delete(checkAuthenticated, isAdmin, userController.delete)

router.post('/checkout', checkAuthenticated, userController.payment);
    
module.exports = router;