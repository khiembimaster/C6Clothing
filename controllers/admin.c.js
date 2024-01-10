const Categories = require('../models/category.m')
const Product = require('../models/product.m');
const User = require('../models/user.m')

const Account = require('../models/user.m');
const bcrypt = require('bcrypt');
const saltRounds = 17;
const passport = require('passport');

module.exports = {
    signinPage: async (req, res, next) => {
        try {
            res.render('adminSignin', {
                layout: 'adminSignin',
                css: () => 'js/empty',
                js: () => 'js/empty'
            })
        } catch (error) {
            next(error)
        }
    },
    'login': passport.authenticate('myStrategy', {
        successRedirect: '/admin',
        failureRedirect: '/admin/signin',
        failureFlash: false
    }),
    user: async (req, res, next) => {
        try {
            const rs = await User.All(1, 5);
            const username = req.session.passport?.user?.username || 'Username'
            res.render('manageUser', {
                username: username,
                layout: 'admin',
                users: rs,
                current: 4,
                css: () => 'js/empty',
                js: () => 'js/empty'
            })
        } catch (error) {
            next(error)
        }
    },
    userUpdate: async (req, res, next) => {
        try {
            const username = req.session.passport?.user?.username || 'Username'
            res.render('editUser', {
                username: username,
                layout: 'admin',
                title: 'Edit user',
                'form-action': `https://localhost:${process.env.PORT}/user/${req.params.username}`,
                current: 4,
                css: () => 'js/empty',
                js: () => 'js/editUser'
            })
        } catch (error) {
            next(error)
        }
    },
    dashboard: async (req, res, next) => {
        // res. render dashboard
        const username = req.session.passport?.user?.username || 'Username'
        res.render('dashboard', {
            username: username,
            layout: 'admin',
            current: 1,
            css: () => 'js/empty',
            js: () => 'js/empty'
        })
    },
    category: async (req, res, next) => {
        try {
            const username = req.session.passport?.user?.username || 'Username'
            const page = req.params.page;
            const perPage = req.params.perPage;
            console.log(page, perPage)
            const rs = await Categories.All(1, 5);
            console.log(rs.CatName)
            res.render('manageCategories', {
                layout: 'admin',
                username: username,
                categories: rs,
                current: 3,
                css: () => 'js/empty',
                js: () => 'js/empty'
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
            const username = req.session.passport?.user?.username || 'Username'
            const page = req.params.page;
            const perPage = req.params.perPage;
            console.log(page, perPage)
            const rs = await Product.getAll(1, 5);
            console.log(rs)
            res.render("manageProduct", {
                layout: 'admin',
                username: username,
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
    uploadProduct: async (req, res, next) => {
        try {
            res.redirect('/product/upload');
        } catch (error) {
            next(error)
        }
    },
}