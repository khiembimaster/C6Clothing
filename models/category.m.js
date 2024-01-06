const db = require('./db');
const tbName = 'Categories';
module.exports = class Category{
    constructor(catName){
        
        this.CatName = catName;
    }
    static async All(page = 1 , perPage = 5){
        const rs = await db.findAll(tbName,page,perPage);
        return rs;
    }
    static async Add(cat){
        await db.add(tbName, cat);
        return cat;
    }
    static async Get(catID){
        const rs = await db.one(tbName, 'CatID', catID);
        return rs;
    }
    static async Del(catID){
        const rs = await db.del(tbName, 'CatID', catID);
        return rs;
    }
    static async Update(id,cat){
        const rs = await db.update(tbName, {field:"CatID", value:id}, cat);
        return rs;
    }
}