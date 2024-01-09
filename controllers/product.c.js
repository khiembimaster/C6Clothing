const Product = require('../models/product.m');
const Category = require('../models/category.m');
require('dotenv').config('.env');
const crypto = require('crypto');
const sharp = require('sharp');
const Handlebars = require('handlebars');
const { category } = require('./admin.c');

Handlebars.registerHelper("list", function (n, prev, page, next) {
    if (n < 1) return;

    var accum = '';
    console.log("page" + page);

    accum += `
    <li class="page-item">
        <button class="page-link" tabindex="-1" aria-disabled="true" value="${prev}">Previous</button>
    </li>`
    for (var i = 1; i <= n; i++) {
        accum += `<li class="page-item"><button class="page-link" value="${1}" ${page == i ? "active" : ''}>${i}</button></li>`;
    }
    accum += `
    <li class="page-item">
        <button class="page-link" tabindex="-1" aria-disabled="true" value="${next}">Next</button>
    </li>`
    return new Handlebars.SafeString(accum);
})

module.exports = {
    uploadPage: async (req, res, next) => {
        const categories = await Category.All(1, 10);
        res.render('addProduct', {
            layout: 'admin',
            current: 2,
            title: "Upload product",
            'form-action': `https://localhost:${process.env.PORT}/product`,
            'categories': categories,
            css: () => 'css/uploadProduct',
            js: () => 'js/uploadProduct'
        })
    },
    updatePage: async (req, res, next) => {
        const id = req.params.id;
        const prod = await Product.GetByID(id)
        res.render('addProduct', {
            layout: 'admin',
            current: 2,
            prod: prod,
            title: "Edit product",
            'form-action': `https://localhost:${process.env.PORT}/product/${req.params.id}`,
            css: () => 'js/empty',
            js: () => 'js/editProduct'
        })
    },
    upload: async (req, res, next) => {
        try {
            const name = req.body.name;
            const tinyDes = req.body.tiny;
            const fullDes = req.body.full;
            const price = Number.parseFloat(req.body.price) || 0;
            const category = req.body.category;
            const quantity = Number.parseInt(req.body.quantity) || 0;
            const buffer = await sharp(req.file.buffer).resize({ height: 640, width: 1080, fit: "contain" }).toBuffer();
            const image = crypto.randomUUID();

            await Product.Add(new Product(name, tinyDes, fullDes, price, category, quantity, image), buffer, req.file.mimetype);

            res.redirect('/admin/product');
        } catch (error) {
            next(error);
        }
    },
    all: async (req, res, next) => {
        try {
            let params = {
                page: parseInt(req.query.page) || 1,
                perPage: parseInt(req.query.per_page) || 5,
                search: req.query.search || "",
                sort: req.query.sort || null,
                order: req.query.order || "ASC",
                minPrice: req.query.min_price || null,
                maxPrice: req.query.max_price || null
            }
            const result = await Product.All(params);
            if (Object.keys(req.query).length <= 1) {
                const categories = await Category.All();
                let user = null;
                if (req.session.passport) {
                    user = req.session.passport.user
                }
                res.render('products_list', {
                    'search': params.search,
                    'user': user,
                    'title': 'Products',
                    'section': 'ALL PRODUCT',
                    'products': result.data,
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                    'min_price': params.minPrice || 0,
                    'max_price': params.maxPrice || 100,
                    'categories': categories,
                    css: () => 'css/products_list',
                    js: () => 'js/products_list'
                });
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
    get: async (req, res, next) => {
        try {
            try {
                const product = await Product.GetByID(req.params.id);
                const categories = await Category.All();
                let user = null;
                if (req.session.passport) {
                    user = req.session.passport.user
                }
                res.render('product_detail', {
                    'product': product,
                    'user': user,
                    'categories': categories,
                    css: () => 'css/product_detail',
                    js: () => 'js/product_detail'
                });


            } catch (error) {
                next(error);
            }
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            await Product.DelByID(req.params.id);
            res.send('ok');
        } catch (error) {
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            // const buffer = await sharp(req.file.buffer).resize({ height: 640, width: 1080, fit: "contain" }).toBuffer();

            await Product.Update(req.params.id, null, null,
                new Product(
                    req.body.name,
                    req.body.tiny,
                    req.body.full,
                    req.body.price,
                    null,
                    req.body.quantity,
                    req.body.image
                ));
            res.send('back');
        } catch (error) {
            next(error);
        }
    },
}