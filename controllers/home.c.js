const Category = require('../models/category.m');
const User = require('../models/user.m')
const Cart = require('../models/cart.m')
const cartItem = require('../models/cartItems.m');
const Product = require('../models/product.m')
const { ColumnSet } = require('pg-promise');
module.exports = {
    homePage: async (req, res, next) => {
        try {
            let user = null;
            if (req.session.passport) {
                user = req.session.passport.user.username
            }
            const u = await User.Get(user)
            const categories = await Category.All();
            if(u!=null)
            {
                const userCart = await Cart.GetByUserID(u.ID);
                const cartItems = await cartItem.GetByCartID(userCart.ID);
                var products = 0;
                for(let cartItem of cartItems){
                    const rs3 = await Product.GetByID(cartItem.ProductID);
                    cartItem['ProName'] = rs3.ProName
                    cartItem['Price'] = rs3.Price
                    cartItem['Image'] = rs3.ImageUrl
                    products += cartItem.Quantity
                }
                console.log(cartItems)
                res.render('homepage', {
                    'user':  user,
                    categories: categories,
                    cartItems: cartItems,
                    css:()=>'css/homepage',
                    js:()=>'js/empty'
                })
            }
            res.render('homepage', {
                'user': user,
                categories: categories,
                css: () => 'css/homepage',
                js: () => 'js/empty'
            })
        } catch (error) {
            next(error);
        }
    },
    aboutUs: async (req, res, next) => {
        try {
            let user = null;
            if(req.session.passport){
                user = req.session.passport.user.username
            }
            const u = await User.Get(user)
            const categories = await Category.All();
            if(u!=null)
            {
                const userCart = await Cart.GetByUserID(u.ID);
                const cartItems = await cartItem.GetByCartID(userCart.ID);
                var products = 0;
                for(let cartItem of cartItems){
                    const rs3 = await Product.GetByID(cartItem.ProductID);
                    cartItem['ProName'] = rs3.ProName
                    cartItem['Price'] = rs3.Price
                    cartItem['Image'] = rs3.ImageUrl
                    products += cartItem.Quantity
                }
                console.log(cartItems)
                res.render('aboutUs', {
                    'user':  user,
                    categories: categories,
                    cartItems: cartItems,
                    css:()=>'css/about',
                    js:()=>'js/empty'
                })
            }
            res.render('aboutUs', {
                'user':  user,
                categories: categories,
                css:()=>'css/about',
                js:()=>'js/empty'
            })
        } catch (error) {
            next(error);
        }
    }

}
