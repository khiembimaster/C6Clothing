const db = require('./db');
const tbName = 'Products';
const imageURL = require('../modules/imageURL');

module.exports = class Product{
    constructor(ProName, TinyDes, FullDes, Price, CatID, Quantity, Image){
        this.ProName = ProName;
        this.TinyDes = TinyDes;
        this.FullDes = FullDes;
        this.Price = Price;
        this.CatID = CatID;
        this.Quantity = Quantity;
        this.Image = Image;
    }
    static async All(page,perPage){
        const products = await db.findAll(tbName,page,perPage);
        for(let product of products){
            if(product.Image){
             
              
                product.ImageUrl = imageURL.getURL(product.Image);
            } else {
                product.ImageUrl = "#";
            }
        }
        return products;
    }
    static async Add(product, buffer, mimetype){
        await db.add(tbName, product);
       
        return imageURL.saveImg(buffer,mimetype,product.Image);
    }
    static async GetByID(proID){
        const product = await db.findOne(tbName, 'ID', proID);
        if(product.Image){

            product.ImageUrl = imageURL.getURL(product.Image);
        } else {
            product.ImageUrl = "#";
        }
        return product;
    }
    static async SearchByName(name,page,perPage){
        const rs = await db.filterByField(tbName,"ProName",name,page,perPage);
        for(let product of rs){
            if(product.Image){

                product.ImageUrl = imageURL.getURL(product.Image);
            } else {
                product.ImageUrl = "#";
            }
        }
        return rs;
    }
    static async DelByID(proID){
        const product = await db.one(tbName, 'ID', proID);
        const input = {
            Bucket: bucketName,
            Key: product.Image,
        }
        const command = new DeleteObjectCommand(input);
        await s3.send(command);
        await db.del(tbName, 'ID', proID);
    }
    static async Update(product){
        const rs = await db.update(tbName, {field:"ID", value:product.ProID}, product);
        return rs;
    }
    static async GetProductsOfCategory(catID,page,perPage){
        const products = await db.findByField(tbName, "CatID", catID,page,perPage);
        for(let product of products){
            if(product.Image){

                product.ImageUrl = imageURL.getURL(product.Image);
            } else {
                product.ImageUrl = "#";
            }
        }
        return products;
    }
    static async FilterByPrice(value1,value2,page,perPage) {
        const rs = await db.filterByField(tbName,"Price",value1,value2,page,perPage);
        for(let product of rs){
            if(product.Image){

                product.ImageUrl = imageURL.getURL(product.Image);
            } else {
                product.ImageUrl = "#";
            }
        }
        return rs;
    }
    static async FilterByDate(value1,value2,page,perPage) {
        const rs = await db.filterByField(tbName,"Date",value1,value2,page,perPage);
        for(let product of rs){
            if(product.Image){
                product.ImageUrl = imageURL.getURL(product.Image);
            } else {
                product.ImageUrl = "#";
            }
        }
        return rs;
    }

}