const Account = require('../models/user.m');
const bcrypt = require('bcrypt');
const saltRounds = 17;
module.exports = {
    all: async(req, res, next) =>{
        try {
            const page = req.params.page;
            const perPage = req.params.perpage;
            const rs = await Account.All(page, perPage);
            console.log(rs);
        } catch (error) {
            next(err);
        }
    },
    get: async(req, res, next) =>{
        try {
            const id = req.params.id;
            const user = await Account.GetById(id);
            console.log(user);
        } catch (error) {
            next(err);
        }
    },
    detele: async(req, res, next) =>{
        try {
            const id = req.params.id;
            const user = await Account.DelById(id);
            console.log(user);
        } catch (error) {
            next(err);
        }
    },
    update: async(req, res, next) =>{
        try {
            const id = req.params.id;
            //const user = await Account.GetById(id)
            const username = req.body.username;
            const password = req.body.password;
            const name = req.body.name;
            const email = req.body.email;
            bcrypt.hash(password, saltRounds, async function(err, hash){
                console.log(password);
                if(err){
                    return next(err);
                }
                const user = new Account(username, hash, name, email);
                console.log(user);
                const rs = await Account.Update(id, user);
                console.log(rs);   
            })
        } catch (error) {
            next(err);
            }
        },
}