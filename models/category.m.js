const db = require('./db');
const tbName = 'Categories';
const imageURL = require('../modules/imageURL');
module.exports = class Category{
    constructor(catName,image){
        this.Image = image;
        this.CatName = catName;
    }
    static async All(page = 1 , perPage = 5){
        const rs = await db.findAll(tbName,page,perPage);
        for(let cat of rs){
            if(cat.Image){ 
               cat.ImageUrl = await imageURL.getURL(cat.Image);
            } else {
                cat.ImageUrl = "#";
            }
        }
        return rs;
    }
    static async Add(cat,buffer,mimetype){
        console.log(cat);
        await db.add(tbName, cat);
        return imageURL.saveImage(buffer,mimetype,cat.Image);
      //  return cat;
    }
    static async Get(catID){

        const rs = await db.one(tbName, 'ID', catID);
        if(rs.Image){
            rs.ImageUrl = imageURL.getURL(product.Image);
        } else {
            rs.ImageUrl = "#";
        }
        return rs;
    }
    static async Del(catID){
        const rs = await db.del(tbName, 'ID', catID);
        return rs;
    }
    static async Update(id,cat,buffer,mimetype){
        const rs = await db.update(tbName, {field:"ID", value:id}, cat);
        return imageURL.saveImage(buffer,mimetype,cat.Image);
       // return rs;
    }
}