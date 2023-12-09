const db = require('./db');
const tbName = 'Carts';
module.exports = class Cart{
    constructor(UserID,Total){
      this.UserID = UserID;
      this.Total = Total;
    }
    static async All(page,perPage){
        const rs = await db.findAll(tbName,page,perPage);
        return rs;
    }
    static async Add(order){
        const rs = await db.add(tbName, order);
        return rs;
    }
    static async Get(id){
        const rs = await db.findOne(tbName, 'ID', id);
        return rs;
    }
    static async Del(id){
        const rs = await db.del(tbName, 'ID',id);
        return rs;
    }
    static async Update(order){
        const rs = await db.update(tbName, order);
        return rs;
    }
    static async GetByUserID(userID){
        const rs = await db.findOne(tbName, 'UserID', userID);
        return rs;
    }
    
    
}