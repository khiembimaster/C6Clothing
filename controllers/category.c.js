const Category = require('../models/category.m');
const Product = require('../models/product.m')
require('dotenv').config('.env');
const crypto = require('crypto');
const sharp = require('sharp');
module.exports = {
    upload: async (req, res, next) => {
        try {
            res.render('categories_creation', {
                'form-action': `https://localhost:${process.env.PORT}/category`,
                css: ()=>'css/products_upload',
                js:()=>'js/products_upload'
            })
        } catch (error) {
            next(error);
        }
    },
    get:  async (req, res, next)=>{
        try{
            const category = await Category.Get(req.params.id);

            let params = {
                category: parseInt(req.params.id),
                page : parseInt(req.query.page) || 1,
                perPage : parseInt(req.query.per_page) || 5,
                search : req.query.search || "",
                sort : req.query.sort || null,
                order : req.query.order || "ASC",
                category : req.query.category || null,
                minPrice : req.query.min_price || null,
                maxPrice : req.query.max_price || null
            }
            
            const result = await Product.All(params);
            
            if(Object.keys(req.query).length === 0){
                let user = null;
                if(req.session.passport){
                    user = req.session.passport.user.username
                }
                const categories = await Category.All();
                res.render('products_list', {
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
                    css: ()=>'css/products_list',
                    js:()=>'js/products_list'
                });
            }else {
                res.render('partials/product_list_comp', {
                    layout: false,
                    'products': result.data,
                    'total': result.count,
                    'totalPages': result.totalPages,
                    'prev': (params.page - 1) || result.totalPages,
                    'page': params.page,
                    'next': (params.page % result.totalPages) + 1,
                });
            }
        }catch(error){
            next(error);
        }
    },
    all: async (req, res, next) => {
        try {
            var page = req.query.page;
            var perpage = req.query.perpage;
            list = await Category.All(page, perpage);
            console.log(list);
            res.send(list);
        } catch (error) {
            next(error);
        }
    },
    add: async (req, res, next) => {
        try {
            console.log(req.body);
            const cat = req.body.catName;
            const buffer = await sharp(req.file.buffer).resize({height:640, width:1080, fit:"contain"}).toBuffer();
            const image = crypto.randomUUID();
            const rs = await Category.Add(new Category(cat,image),buffer, req.file.mimetype);
            res.redirect('/category');
        }
        catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.id;
            const rs = await Category.Del(id);
            res.send(rs);
        }
        catch (error) {
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            const id = req.params.id;
            const cat = req.body.catName;
            const buffer = await sharp(req.file.buffer).resize({height:640, width:1080, fit:"contain"}).toBuffer();
            res.send(Category.Update(id, new Category(cat),buffer,req.file.mimetype));
        } catch (error) {
            next(error);
        }
    }

}