const Cart = require('../models/cart.m');
const User = require('../models/user.m');
const CartItem = require('../models/cartItems.m')
const Product = require('../models/product.m')
const Category = require('../models/category.m');
module.exports = {
    all: async (req, res, next) => {
        try {
            const page = req.params.page;
            const perPage = req.params.perPage;
            const rs = Cart.All(page, perPage);
            console.log(rs);
        } catch (error) {
            next(error)
        }
    },
    add: async (req, res, next) => {
        try {
            const userID = req.body.userID;
            const total = 0;
            const cart = new Cart(userID, total);
            await Cart.Add(cart);
        } catch (error) {
            next(error)
        }
    },
    getByID: async (req, res, next) => {
        try {
            const id = req.params.id;
            const rs = await Cart.Get(id);
            console(rs);
        } catch (error) {
            next(error)
        }
    },
    getByUserID: async (req, res, next) => {
        try {
            const id = req.body.userId;
            const rs = await Cart.GetByUserID(id);
            console(rs);
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.id;
            const rs = await Cart.Del(id);
            const rs1 = await Cart.Del(id);
            console.log(rs, rs1);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            const userID = req.body.userID;
            const total = req.body.total;
            const order = new Cart(userID, total);
            const rs = await Cart.Update(id, order);
            console.log(rs);
        } catch (error) {
            next(error);
        }
    },
    cartPage: async(req, res, next) => {
        try {
            if(!req.session.passport){
                res.sendStatus(500);
            }
            const username = req.session.passport.user.username
            
            const user = await User.Get(username);
            const rs = await Cart.GetByUserID(user.ID);
            console.log(rs);
            const rs1 = await CartItem.GetByCartID(rs.ID);
            var products = 0;
            for(let cartItem of rs1){
                const rs3 = await Product.GetByID(cartItem.ProductID);
                cartItem['ProName'] = rs3.ProName
                cartItem['Price'] = rs3.Price
                cartItem['Image'] = rs3.ImageUrl
                products += cartItem.Quantity
            }
            const categories = await Category.All();
            
            res.render("cart", {
                'user': username,
                'categories': categories,
                cartItems: rs1,
                Cart: products,
                css:()=>'css/cart',
                js:()=>'js/cart'

            })
        } catch (error) {
            next(error)
        }
    }
}
