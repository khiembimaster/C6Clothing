const Categories = require('../models/category.m')
const Product = require('../models/product.m');
const User = require('../models/user.m')

const Account = require('../models/user.m');
const bcrypt = require('bcrypt');
const saltRounds = 17;
const passport = require('passport');


const Handlebars = require('handlebars');
Handlebars.registerHelper("list", function (n, prev, page, next) {
    if (n < 1) return;

    var accum = '';
    console.log("page" + page);

    accum += `
    <li class="page-item">
        <button class="page-link" tabindex="-1" aria-disabled="true" value="${prev}">Previous</button>
    </li>`
    for (var i = 1; i <= n; i++) {
        accum += `<li class="page-item"><button class="page-link  ${page == i ? "active" : ''}" value="${1}">${i}</button></li>`;
    }
    accum += `
    <li class="page-item">
        <button class="page-link" tabindex="-1" aria-disabled="true" value="${next}">Next</button>
    </li>`
    return new Handlebars.SafeString(accum);
})

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
            let params = {
                page: parseInt(req.query.page) || 1,
                perPage: parseInt(req.query.per_page) || 3,
                search: req.query.search || "",
                order: req.query.order || "ASC",
            }
            const result = await User.AllFiltered(params);
            const username = req.session.passport?.user?.username || 'Username'
            result.data = result.data.filter(e => e.Username != username)
            if (Object.keys(req.query).length === 0) {
                res.render('manageUser', {
                    username: username,
                    layout: 'admin',
                    users: result.data,
                    manage: 'user',
                    current: 4,
                    css: () => 'js/empty',
                    js: () => 'js/empty',
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                })
            } else {
                res.render('manageUser', {
                    layout: false,
                    users: result.data,
                    search: params.search,
                    manage: 'user',
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                })
            }
        } catch (error) {
            next(error)
        }
    },
    userUpdate: async (req, res, next) => {
        try {
            const username = req.session.passport?.user?.username || 'Username'
            const rs = await Account.Get(username);
            res.render('editUser', {
                username: username,
                user: rs,
                layout: 'admin',
                title: 'Edit user',
                href: '/admin/user',
                'form-action': `https://localhost:${process.env.PORT}/user/${username}`,
                current: 4,
                css: () => 'js/empty',
                js: () => 'js/editUser'
            })
        } catch (error) {
            next(error)
        }
    },
    addUser: async (req, res, next) => {
        try {
            const username = req.session.passport?.user?.username || 'Username'
            res.render('addUser', {
                username: username,
                layout: 'admin',
                title: 'Add user',
                'form-action': `https://localhost:${process.env.PORT}/user`,
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
        const username = req.session.passport?.user?.username || 'Username'
        res.render('dashboard', {
            username: username,
            layout: 'admin',
            current: 1,
            css: () => 'js/empty',
            js: () => 'js/empty'
        })
    },
    getDashboard: async (req, res, next) => {
        // res. render dashboard
        const refreshToken = req.session.passport.user.wallet;
        const params = {
            token: refreshToken
        }
        const response = await fetch('https://localhost:5000/wallet/refreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        const year = new Date().getFullYear()
        const data = await response.json();
        console.log(data.accessToken);
        const accessToken = data.accessToken;
        const result = await fetch(`https://localhost:5000/admin/transactions?start=${year}-01-01T00:00:00Z&end=${year}-12-31T23:59:59Z`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        const rs = await result.json()
        console.log(rs)
        res.send(rs);
    },
    category: async (req, res, next) => {
        try {
            let params = {
                page: parseInt(req.query.page) || 1,
                perPage: parseInt(req.query.per_page) || 3,
                search: req.query.search || "",
                order: req.query.order || "ASC",
            }
            const result = await Categories.AllFiltered(params);
            const username = req.session.passport?.user?.username || 'Username'
            if (Object.keys(req.query).length === 0) {
                res.render('manageCategories', {
                    username: username,
                    layout: 'admin',
                    categories: result.data,
                    manage: 'category',
                    current: 3,
                    css: () => 'js/empty',
                    js: () => 'js/empty',
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                })
            } else {
                res.render('manageCategories', {
                    layout: false,
                    categories: result.data,
                    search: params.search,
                    manage: 'category',
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                })
            }
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
            let params = {
                page: parseInt(req.query.page) || 1,
                perPage: parseInt(req.query.per_page) || 3,
                search: req.query.search || "",
                order: req.query.order || "ASC",
            }
            const result = await Product.All(params);
            if (Object.keys(req.query).length === 0) {
                res.render('manageProduct', {
                    username: username,
                    layout: 'admin',
                    products: result.data,
                    manage: 'product',
                    current: 2,
                    css: () => 'js/empty',
                    js: () => 'js/empty',
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                })
            } else {
                res.render('manageProduct', {
                    layout: false,
                    products: result.data,
                    search: params.search,
                    manage: 'product',
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                })
            }
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