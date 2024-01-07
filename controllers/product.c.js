const Product = require('../models/product.m');
const Category = require('../models/category.m');
require('dotenv').config('.env');
const crypto = require('crypto');
const sharp = require('sharp');
const Handlebars = require('handlebars');

Handlebars.registerHelper("list", function(n, options){
    var accum = '';
    console.log(n);
    for(var i = 1; i <= n; i++){
        accum += options.fn(i);
    }
    return accum;
})

module.exports = {
    uploadPage: async(req, res, next)=>{
        const categories = await Category.All(1, 10);
        res.render('products_upload', {
            'form-action': `https://localhost:${process.env.PORT}/product`,
            'categories': categories,
            css: ()=>'css/products_upload',
            js:()=>'js/products_upload'
        })
    },
    upload: async (req, res, next)=>{
        try{    
            const name = req.body.name;
            const tinyDes = req.body.tiny;
            const fullDes = req.body.full;
            const price = Number.parseFloat(req.body.price) || 0;
            const category = req.body.category;
            const quantity = Number.parseInt(req.body.quantity) || 0;
            const buffer = await sharp(req.file.buffer).resize({height:640, width:1080, fit:"contain"}).toBuffer();
            const image = crypto.randomUUID();
            
            await Product.Add(new Product(name, tinyDes, fullDes, price,category,quantity, image), buffer, req.file.mimetype);
            
            res.redirect('/admin/product');
            
        }catch(error){
            next(error);
        }
    },
    all: async (req, res, next)=>{
        try{
            
            let params = {
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
            const categories = await Category.All();
            
            res.render('products_list', {
                title: 'Products',
                products: result.data,
                total: result.count,
                totalPages: result.totalPages,
                prev: (params.page - 1) || result.count,
                next: (params.page % result.count) + 1,
                'categories': categories,
                css: ()=>'css/products_list',
                js:()=>'js/products_list'
            });
            
        }catch(error){
            next(error);
        }
    },
    get: async (req, res, next)=>{
        try{
            try{
                const product = await Product.GetByID(req.params.id);
                res.send(product);
            }catch(error){
                next(error);
            }
        }catch(error){
            next(error);
        }
    },
    delete: async (req, res, next)=>{
        try{
            await Product.DelByID(req.params.id);   
            console.log("12121")
            await res.redirect('/admin/product');   
        }catch(error){
            next(error);
        }
    },
    edit: async (req, res, next)=>{
        try{
            const buffer = await sharp(req.file.buffer).resize({height:640, width:1080, fit:"contain"}).toBuffer();
            
            await Product.Update(req.params.id, buffer, req.file.mimetype, 
                new Product(
                req.body.name,
                req.body.tiny,
                req.body.full,
                req.body.price,
                req.body.category,
                req,body.quantity,
                req.body.image
            ));
            
        }catch(error){
            next(error);
        }
    },
}