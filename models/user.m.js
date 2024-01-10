const db = require('./db');
const Cart = require('./cart.m');
const tbName = 'Users';
module.exports = class Account {
    constructor(username, password, name, email, permission) {
        this.Username = username;
        this.Password = password;
        this.Name = name;
        this.Email = email;
        this.Permission = permission ? permission : 1;
    }
    static async All(page, perPage) {
        const rs = await db.findAll(tbName, page, perPage);
        return rs;
    }
    static async Add(user) {
        const UserID = await db.add(tbName, user);
        const rs = await Cart.Add(new Cart(UserID, 0));

        console.log(user);
        // const params = {
        //     id: user.Email,
        //     balance: 0
        // }
        // const response = await fetch('https://localhost:5000/wallet', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(params)
        // });
        // const data = await response.json();
        // console.log(data);
        return rs;
    }
    static async Get(username) {
        const rs = await db.findOne(tbName, 'Username', username);
        // ------------- //
        //--------------//
        return rs;
    }
    static async Del(username) {
        const rs = await db.del(tbName, 'Username', `'${username}'`);
        return rs;
    }
    static async Update(user) {
        const condition = {
            value: user.Username,
            field: "Username"
        }
        const rs = await db.update(tbName, condition, user);
        return rs;
    }


}