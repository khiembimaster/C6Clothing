const Item = require('../models/cartItems.m');
const Cart = require('../models/cart.m')
const User = require('../models/user.m')
const Product = require('../models/product.m')
const productController = require('./product.c')
module.exports = {
    add: async(req, res, next) => {
        try {
            const user = await User.Get(req.session.passport.user.username);
            if(user != null)
            {
                var q = 0;
                var product = await Product.GetByID(req.body.product_id);
                const quantity = req.body.quantity;
                
                if(product.Quantity > quantity)
                {
                    q = product.Quantity - quantity;
                    product.Quantity = q;
                    console.log(product)
                    let objectWithoutImgURL = Object.assign({}, product);
                    delete objectWithoutImgURL.ImageUrl;
                    await Product.UpdateQuanntity(req.body.product_id,objectWithoutImgURL)
                    const userCart = await Cart.GetByUserID(user.ID)
                    const productID = req.body.product_id;
                    const createDate = new Date().toLocaleDateString();
                    const initialQuantity = req.body.quantity;
                    const cartItem = new Item(userCart.ID, productID, createDate, initialQuantity);
                    await Item.Add(cartItem);
                    res.json({'quantity' : q});    
                }else {
                    res.json("Not enough");
                }
            }
            
        } catch (error) {
            next(error);
        }
    },
    delete: async(req, res, next)=>{
        try {
            const id = req.params.id;
            const cartItem = await Item.Get(id);
            var product = await Product.GetByID(cartItem.ProductID);
            const quantity = cartItem.Quantity;
            var q = 0;
            q = product.Quantity + quantity;
                product.Quantity = q;
                console.log(product)
                let objectWithoutImgURL = Object.assign({}, product);
                delete objectWithoutImgURL.ImageUrl;
                await Product.UpdateQuanntity(cartItem.ProductID,objectWithoutImgURL)
            const rs = await Item.Del(id);
            //res.redirect('admin/category');
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
            const id = req.params.id;
            const cartItem = await Item.Get(id);
            var product = await Product.GetByID(cartItem.ProductID);
            console.log("111", product); 
            const q = cartItem.Quantity - req.body.quantity;
            var q1 = 0;
                q1 = product.Quantity + q;
                product.Quantity = q1;
                console.log(product.Quantity)
                let objectWithoutImgURL = Object.assign({}, product);
                delete objectWithoutImgURL.ImageUrl;
                await Product.UpdateQuanntity(cartItem.ProductID,objectWithoutImgURL)
            const data = {
                Date: new Date(),
                Quantity: req.body.quantity
            }
            const rs = await Item.Update(id, data);
            // console.log('ok');
            res.send(rs);
        } catch (error) {
            next(error)
        }
    }
}