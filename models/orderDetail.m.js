const db = require('./db');
const tbName = 'OrderDetails';
module.exports = class Order{
    constructor(OrderID,ProductID,Quantity,Price,Amount){
      this.OrderID = OrderID;
      this.ProductID = ProductID;
      this.Quantity = Quantity;
      this.Price =Price;
      this.Amount = Amount;
    }
    static async All(page,perPage){
        const rs = await db.findAll(tbName,page,perPage);
        return rs;
    }
    static async Add(orderDetail){
        const rs = await db.add(tbName, orderDetail);
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
    static async Update(orderDetail){
        const rs = await db.update(tbName, orderDetail);
        return rs;
    }
    static async GetByOrderID(orderID,page,perPage) {
        const rs = await db.findByField(tbName,"OrderID",orderID,page,perPage);
        return rs;
    }
    
}