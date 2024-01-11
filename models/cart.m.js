const db = require('./db');
const tbName = 'Carts';
const CartItemDel = require('./cartItems.m').Del
module.exports = class Cart {
    constructor(UserID, Total) {
        this.UserID = UserID;
        this.Total = Total;
    }
    static async All(page, perPage) {
        const rs = await db.findAll(tbName, page, perPage);
        return rs;
    }
    static async Add(order) {
        const rs = await db.add(tbName, order);
        return rs;
    }
    static async Get(id) {
        const rs = await db.findOne(tbName, 'ID', id);
        return rs;
    }
    static async DelByUserID(userID) {
        const id = await db.findOne(tbName, 'UserID', userID);
        const cartItems = await db.findByField('CartItems', 'CartID', id)
        for (var cartItem of cartItems) {
            await CartItemDel(cartItem.ID);
        }
        const rs = await db.del(tbName, 'ID', id);
        return rs;
    }
    static async Update(id, order) {
        const condition = {
            value: id,
            field: "ID"
        }
        const rs = await db.update(tbName, condition, order);
        return rs;
    }
    static async GetByUserID(userID) {
        const rs = await db.findOne(tbName, 'UserID', userID);
        return rs;
    }


}