const Categories = require('../models/category.m')
const Product = require('../models/product.m');
module.exports = {
    upload: async (req, res, next) => {
        try {
            res.render('categories_creation', {
                'form-action': `https://localhost:${process.env.PORT}/category`,
                css: () => 'css/products_upload',
                js: () => 'js/products_upload'
            })
        } catch (error) {
            next(error);
        }
    },
    dashboard: async (req, res, next) => {
        // res. render dashboard
        res.render('admin/adminLayout', {
            content: () => 'admin/dashboard',
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
            console.log(rs.CatName)
            res.render('admin/adminLayout', {
                content: () => 'admin/manageCategories',
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
            res.render("admin/adminLayout", {
                content: () => 'admin/manageProduct',
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
    }
}