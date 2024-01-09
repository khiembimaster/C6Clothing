const db = require('./db');
const tbName = 'Categories';
const imageURL = require('../modules/imageURL');
module.exports = class Category{
    constructor(catName,image){
        this.Image = image;
        this.CatName = catName;
    }

    static async All(page=1, perPage=5){
        console.log(page, perPage)
        const rs = await db.findAll(tbName,page,perPage);
        for(let cat of rs){
            if(cat.Image){ 
               cat.ImageUrl = await imageURL.getURL(cat.Image);
            } else {
                cat.ImageUrl = "#";
            }
        }
        console.log(rs)
        return rs;
    }
    static async Add(cat,buffer,mimetype){
        console.log(cat);
        await db.add(tbName, cat);
        return imageURL.saveImage(buffer,mimetype,cat.Image);
      //  return cat;
    }
    static async Get(catID){
        const rs = await db.findOne(tbName, 'ID', catID);
        if(rs.Image){
            rs.ImageUrl = await imageURL.getURL(rs.Image);
        } else {
            rs.ImageUrl = "#";
        }
        return rs;
    }
    static async Del(catID){
        const products = await db.findByField('Products', 'CatID', catID);
        for(var product of products){
            await imageURL.deleteImage(product.Image);
            await db.del('Products', 'ID', product.ID);
        }
        const category = await this.Get(catID);
        await imageURL.deleteImage(category.Image);
        const rs = await db.del(tbName, 'ID', catID);
        return rs;
    }
    static async Update(id,cat,buffer,mimetype){
        const rs = await db.update(tbName, {field:"ID", value:id}, cat);
        return imageURL.saveImage(buffer,mimetype,cat.Image);
       // return rs;
    }
}