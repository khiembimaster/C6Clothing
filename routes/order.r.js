const express = require('express');

const router = express.Router();
// const productController = require('../controllers/product.c');
const order = require('../controllers/order.c');
router.route('/')
    .get(order.All)      // Order history
    .post(order.Add)     // Order placement

router.route('/:id')
    .get(order.GetOne)      // Order details
    
module.exports = router;