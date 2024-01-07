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
    static async All(params){
        let filters = [];
        if(params.category) filters.push(`"CatID" = ${params.category}`);
        if(params.minPrice) filters.push(`"Price" >= ${params.minPrice}`);
        if(params.maxPrice) filters.push(`"Price" <= ${params.maxPrice}`);

        const result = await db.searchAndFilter(tbName,params.page,params.perPage, 
            {key:'ProName', value:params.search}, filters, {field:'Price', order: params.order} );
        
        for(let product of result.data){
            if(product.Image){ 
                product.ImageUrl = await imageURL.getURL(product.Image);
            } else {
                product.ImageUrl = "#";
            }
        }
        return result;
    }
    static async Add(product, buffer, mimetype){
        console.log(product)
        await db.add(tbName, product);
       
        return imageURL.saveImage(buffer,mimetype,product.Image);
    }
    static async GetByID(proID){
        const product = await db.findOne(tbName, 'ProID', proID);
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
    static async Update(id, buffer, mimetype, product){
        await db.update(tbName, {field:"ID", value:id}, product);
        return imageURL.saveImage(buffer,mimetype,product.Image);
    }
}