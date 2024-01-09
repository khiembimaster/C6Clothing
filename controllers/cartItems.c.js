const Item = require('../models/cartItems.m');
const Cart = require('../models/cart.m')
const User = require('../models/user.m')
const Product = require('../models/product.m')
module.exports = {
    add: async(req, res, next) => {
        try {
            const cartID  = req.body.cartID;
            const productID = req.body.productID;
            const date = new Date();
            const quantity = req.body.quantity;
            const item = new Item(cartID, productID, date.getDate(), quantity);
            const rs = await Item.Add(item);
            console.log(rs);
        } catch (error) {
            next(error);
        }
    },
    delete: async(req, res, next)=>{
        try {
            const id = req.params.id;
            console.log(id)
            const r = await Item.Del(id);
            console.log(rs);
            
            
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
            console.log(req.body)
            const user = await User.Get(req.session.passport.user);
            console.log("11", user)
            const c = await Cart.GetByUserID(user.ID)
            console.log(c)
            const id = req.params.id;
            const date = new Date();
            const quantity = req.body.quantity;
            const item = new Item(c.ID, id, null, quantity);
            console.log(item)
            const rs = await Item.Add(item);
            console.log(rs);
        } catch (error) {
            next(error)
        }
    }
}