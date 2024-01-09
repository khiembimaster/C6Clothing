const Categories = require('../models/category.m')
const Product = require('../models/product.m');
const User = require('../models/user.m')
module.exports = {
    user: async (req, res, next) => {
        try {
            const page = req.params.page;
            const perPage = req.params.perPage;
            const rs = await User.All(1, 5);
            res.render('manageUser', {
                layout: 'admin',
                user: rs,
                current: 4,
                css: () => 'js/empty',
                js: () => 'js/empty'
            })
        } catch (error) {
            next(error)
        }
    },
    dashboard: async (req, res, next) => {
        // res. render dashboard
        res.render('dashboard', {
            layout: 'admin',
            current: 1,
            css: () => 'js/empty',
            js: () => 'js/empty'
        })
    },
    category: async (req, res, next) => {
        try {
            const page = req.params.page;
            const perPage = req.params.perPage;
            console.log(page, perPage)
            const rs = await Categories.All(1, 5);
            res.render('manageCategories', {
                layout: 'admin',
                categories: rs,
                current: 3,
                css: () => 'js/empty',
                js: () => 'js/empty'
            })
        } catch (error) {
            next(error)
        }
    },
    deleteCategory: async (req, res, next) => {

    },
    updateCategory: async (req, res, next) => {
        try {
            const id = req.params.id;
            const cat = Categories.Get(id)
            res.render('addCategory', {
                layout: 'admin',
                cat: cat,
                current: 3,
                'form-action': `https://localhost:${process.env.PORT}/admin/category`,
                css: () => 'css/addCategory',
                js: () => 'js/addCategory'
            })
        } catch (error) {
            next(error)
        }
    },
    uploadCategory: async (req, res, next) => {
        try {
            res.redirect('/category/upload');
        } catch (error) {
            next(error)
        }
    },
    product: async (req, res, next) => {
        try {
            const page = req.params.page;
            const perPage = req.params.perPage;
            console.log(page, perPage)
            const rs = await Product.getAll(1, 5);
            console.log(rs)
            res.render("manageProduct", {
                layout: 'admin',
                products: rs,
                current: 2,
                css: () => 'css/manageCategories',
                js: () => 'js/empty'
            }
            )
        } catch (error) {
            next(error)
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const id = req.params.id;
            req.redirect(`/product/` + id)
        } catch (error) {
            next(error)
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const id = req.params.id;
            const prod = Product.Get(id)
            res.render('addProduct', {
                layout: 'admin',
                prod: prod,
                current: 3,
                'form-action': `https://localhost:${process.env.PORT}/admin/product`,
                css: () => 'css/addProduct',
                js: () => 'js/addProduct'
            })
        } catch (error) {
            next(error)
        }
    },
    uploadProduct: async (req, res, next) => {
        try {
            res.redirect('/product/upload');
        } catch (error) {
            next(error)
        }
    }
}