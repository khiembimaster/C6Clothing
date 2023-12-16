const db = require('./db');
const tbName = 'CartItems';
module.exports = class Item{
    constructor(CatID, ProductID, Date, Quantity){
        this.CatID = CatID;
        this.ProductID = ProductID;
        this.Date = Date;
        this.Quantity = Quantity;
    }
    static async All(page,perPage){
        const rs = await db.findAll(tbName,page,perPage);
        return rs;
    }
    static async Add(item){
        const rs = await db.add(tbName, item);
        return rs;
    }
    static async Get(id){
        const rs = await db.findOne(tbName, 'ID', id);
        return rs;
    }
    static async Del(id){
        const rs = await db.del(tbName, 'CartID', id);
        return rs;
    }
    static async Update(id, item){
        const condition = {
            value: id,
            field: "ID"
        }
        const rs = await db.update(tbName, condition, item);
        return rs;
    }
    static async GetByCartID(cartID){
        const rs = await db.findOne(tbName, 'CartID', cartID);
        return rs;
    }
    static async All(page,perPage){
        const rs = await db.findAll(tbName,page,perPage);
        return rs;
    }
}