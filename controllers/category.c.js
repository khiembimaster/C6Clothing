const Category = require('../models/category.m');
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