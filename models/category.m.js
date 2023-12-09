const db = require('./db');
const tbName = 'Categories';
module.exports = class Category{
    constructor(catName){
     
        this.CatName = catName;
    }
    static async All(){
        const rs = await db.all(tbName);
        return rs;
    }
    static async Add(cat){
        console.log(cat);
        await db.add(tbName, {CatName: cat.CatName});
        return rs;
    }
    static async Get(catID){
        const rs = await db.one(tbName, 'CatID', catID);
        return rs;
    }
    static async Del(catID){
        const rs = await db.del(tbName, 'CatID', catID);
        return rs;
    }
    static async Update(cat){
        const rs = await db.update(tbName, {field:"CatID", value:cat.CatID}, cat);
        return rs;
    }
}