const db = require('./db');
const tbName = 'Categories';
const imageURL = require('../modules/imageURL');
const { GetByID } = require('./product.m');
const Product = require('./product.m');
module.exports = class Category {
    constructor(catName, image) {
        this.Image = image;
        this.CatName = catName;
    }
    static async AllFiltered(params) {
        let filters = [];

        const result = await db.searchAndFilter(tbName, params.page, params.perPage,
            { key: 'CatName', value: params.search }, filters, { field: 'CatName', order: params.order });

        for (let category of result.data) {
            if (category.Image) {
                category.ImageUrl = await imageURL.getURL(category.Image);
            } else {
                category.ImageUrl = "#";
            }
        }
        return result;
    }
    static async All(page = 1, perPage = 5) {
        console.log(page, perPage)
        const rs = await db.findAll(tbName, page, perPage);
        for (let cat of rs) {
            if (cat.Image) {
                cat.ImageUrl = await imageURL.getURL(cat.Image);
            } else {
                cat.ImageUrl = "#";
            }
        }
        console.log(rs)
        return rs;
    }
    static async Add(cat, buffer, mimetype) {
        console.log(cat);
        await db.add(tbName, cat);
        return imageURL.saveImage(buffer, mimetype, cat.Image);
        //  return cat;
    }
    static async Get(catID) {
        const rs = await db.findOne(tbName, 'ID', catID);
        if (rs.Image) {
            rs.ImageUrl = await imageURL.getURL(rs.Image);
        } else {
            rs.ImageUrl = "#";
        }
        return rs;
    }
    static async Del(catID) {
        const products = await db.findByField('Products', 'CatID', catID);
        for (var product of products) {
            await Product.DelByID(product.ID);
            await imageURL.deleteImage(product.Image);
        }
        const category = await this.Get(catID);
        await imageURL.deleteImage(category.Image);
        const rs = await db.del(tbName, 'ID', catID);
        return rs;
    }
    static async Update(id, cat, buffer, mimetype) {
        const dbCategory = await this.Get(id)
        cat.Image = dbCategory.Image
        const rs = await db.update(tbName, { field: "ID", value: id }, cat);
        //return imageURL.saveImage(buffer,mimetype,cat.Image);
        // return rs;
    }
}