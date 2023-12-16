const Product = require('../models/product.m');
require('dotenv').config('.env');
const crypto = require('crypto');
const sharp = require('sharp');

module.exports = {
    upload: async (req, res, next)=>{
        try{    
            const name = req.body.name;
            const tinyDes = req.body.tiny;
            const fullDes = req.body.full;
            const price = req.body.price;
            const category = req.body.category;
            const quantity = req.body.quantity;
            const buffer = await sharp(req.file.buffer).resize({height:640, width:1080, fit:"contain"}).toBuffer();
            const image = crypto.randomUUID();
            
            await Product.Add(new Product(name, tinyDes, fullDes, price,category,quantity, image), buffer, req.file.mimetype);
            
            res.redirect('/product');
            
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
            const products = await Product.All(params);
            console.log(products);
            res.render('products', {
                title: 'Products',
                theme: req.session.isDark ? 'dark':'light',
                products: products
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