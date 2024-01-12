const Category = require('../models/category.m');
const Product = require('../models/product.m')
require('dotenv').config('.env');
const crypto = require('crypto');
const sharp = require('sharp');
const User = require('../models/user.m')
const Cart = require('../models/cart.m')
const cartItem = require('../models/cartItems.m');
module.exports = {
    upload: async (req, res, next) => {
        try {
            res.render('addCategory', {
                layout: 'admin',
                title: "Upload category",
                current: 3,
                'form-action': `https://localhost:${process.env.PORT}/category`,
                css: () => 'css/uploadCategory',
                js: () => 'js/uploadCategory'
            })
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const catID = req.params.id;
            const category = await Category.Get(catID);
            res.render('addCategory', {
                layout: 'admin',
                title: "Edit category",
                current: 3,
                'category': category,
                'form-action': `https://localhost:${process.env.PORT}/category/${catID}`,
                css: () => 'js/empty',
                js: () => 'js/editCategory'
            })
        } catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const category = await Category.Get(req.params.id);

            let params = {
                category: parseInt(req.params.id),
                page: parseInt(req.query.page) || 1,
                perPage: parseInt(req.query.per_page) || 5,
                search: req.query.search || "",
                sort: req.query.sort || null,
                order: req.query.order || "ASC",
                minPrice: req.query.min_price || null,
                maxPrice: req.query.max_price || null
            }

            const result = await Product.All(params);
            let mostExpensive = 0;
            if(result.data){
                mostExpensive = result.data.reduce(function(prev, current) {
                    return (prev && prev.Price > current.Price) ? prev : current
                }, 0) 
            }
            
            if (Object.keys(req.query).length <= 1) {
                const categories = await Category.All();
                let user = null;
                if (req.session.passport) {
                    user = req.session.passport.user.username
                }
                const u = await User.Get(user)
                if (u != null) {
                    const userCart = await Cart.GetByUserID(u.ID);
                    const cartItems = await cartItem.GetByCartID(userCart.ID);
                    var products = 0;
                    for (let cartItem of cartItems) {
                        const rs3 = await Product.GetByID(cartItem.ProductID);
                        cartItem['ProName'] = rs3.ProName
                        cartItem['Price'] = rs3.Price
                        cartItem['Image'] = rs3.ImageUrl
                        products += cartItem.Quantity
                    }
                    res.render('products_list', {
                        'search': params.search,
                        'user': user,
                        cartItems: cartItems,
                        'title': 'Products',
                        'section': category.CatName.toUpperCase(),
                        'products': result.data,
                        'total': result.count,
                        'totalPages': result.totalPages,
                        'prev': (params.page - 1) || result.totalPages,
                        'page': params.page,
                        'next': (params.page % result.totalPages) + 1,
                        'min_price': params.minPrice || 0,
                        'max_price': params.maxPrice || 100,
                        'categories': categories,
                        'most_expensive': mostExpensive.Price,
                        css: () => 'css/products_list',
                        js: () => 'js/products_list'
                    });
                }
                else {
                    res.render('products_list', {
                        'search': params.search,
                        'user': user,
                        'title': 'Products',
                        'section': category.CatName.toUpperCase(),
                        'products': result.data,
                        'total': result.count,
                        'totalPages': result.totalPages,
                        'prev': (params.page - 1) || result.totalPages,
                        'page': params.page,
                        'next': (params.page % result.totalPages) + 1,
                        'min_price': params.minPrice || 0,
                        'max_price': params.maxPrice || 100,
                        'categories': categories,
                        'most_expensive': mostExpensive.Price,
                        css: () => 'css/products_list',
                        js: () => 'js/products_list'
                    });
                }
            } else if (req.query.page == null) {
                res.render('partials/product_list_comp', {
                    layout: false,
                    'products': result.data,
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': result.totalPages,
                    'page': 1,
                    'next': (1 % result.totalPages) + 1,
                });
            }
            else {
                res.render('partials/product_list_comp_products', {
                    layout: false,
                    'products': result.data,
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    all: async (req, res, next) => {
        try {
            var page = req.query.page;
            var perpage = req.query.perpage;
            list = await Category.All(page, perpage);
            res.send(list);
        } catch (error) {
            next(error);
        }
    },
    add: async (req, res, next) => {
        try {
            const cat = req.body.catName;
            const buffer = await sharp(req.file.buffer).resize({ height: 640, width: 1080, fit: "contain" }).toBuffer();
            const image = crypto.randomUUID();
            const rs = await Category.Add(new Category(cat, image), buffer, req.file.mimetype);
            res.redirect('admin/category');
        }
        catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.id;
            await Category.Del(id);
            res.send('oke')
        }
        catch (error) {
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            const id = req.params.id;
            const cat = req.body.catName;
            //const buffer = await sharp(req.file.buffer).resize({ height: 640, width: 1080, fit: "contain" }).toBuffer();
            res.send(Category.Update(id, new Category(cat), null, null));
        } catch (error) {
            next(error);
        }
    }

}