const Item = require('../models/cartItems.m');
const Cart = require('../models/cart.m')
const User = require('../models/user.m')
const Product = require('../models/product.m')
module.exports = {
    add: async(req, res, next) => {
        try {
            //Get the cart associated to the loggeg user
            if(!req.session.passport){ // Check for authenthication. This will be done by another middleware
                res.sendStatus(500)
            }
            const user = await User.Get(req.session.passport.user.username);
            const userCart = await Cart.GetByUserID(user.ID)

            const productID = req.body.product_id;
            const createDate = new Date().toLocaleDateString();
            const initialQuantity = req.body.quantity;
            const cartItem = new Item(userCart.ID, productID, createDate, initialQuantity);
            const rs = await Item.Add(cartItem);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    },
    delete: async(req, res, next)=>{
        try {
            const id = req.params.id;
            console.log(id)
            const rs = await Item.Del(id);
            console.log(rs);
            res.status(200).send(rs);
            
        } catch (error) {
            next(error);
        }
    },
    getAll: async(req, res, next)=>{
        try {
            const page = req.params.page;
            const perPage = req.params.perPage;
            const rs = await Item.All(page, perPage);
            console.log(rs);
        } catch (error) {
            next(error)
        }
    },
    getByID: async(req, res, next)=>{
        try {
            const id = req.params.id;
            const rs= await Item.getByID(id);
            console.log(rs);
        } catch (error) {
            next(error);
        }
    }, 
    getByUserID: async(req, res, next) => {
        try {
            const cartID = req.params.userID;
            const rs = await Item.GetByCartID(cartID);
            console.log(rs);
        } catch (error) {
            next(error);
        }
    }, 
    update: async(req, res, next) =>{
        try {
            const cartItemID = req.params.id;    
            console.log(req.body);        
            const data = {
                Date: new Date(),
                Quantity: req.body.quantity
            }
            const rs = await Item.Update(cartItemID, data);
            // console.log('ok');
            res.send(rs);
        } catch (error) {
            next(error)
        }
    }
}