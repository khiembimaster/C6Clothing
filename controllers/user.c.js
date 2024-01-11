const { use } = require('passport');
const Account = require('../models/user.m');
const User = require('../models/user.m')
const bcrypt = require('bcrypt');
const saltRounds = 17;
module.exports = {
    all: async (req, res, next) => {
        try {
            const page = req.params.page;
            const perPage = req.params.perPage;
            const rs = User.All(page, perPage);
            return rs;
        } catch (error) {
            next(error)
        }
    },
    add: async (req, res, next) => {
        try {
            const { username, password, name, email } = req.body;
            const newUser = new User(username, password, name, email);
            await User.Add(newUser);

        } catch (error) {
            next(error)
        }
    },
    get: async (req, res, next) => {
        try {
            const username = req.params.id;
            const rs = await User.Get(username);
            return rs;
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const username = req.params.username;
            await User.Del(username);
            res.send('oke')
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const username = req.params.username;
            console.log(username);
            const user = await User.Get(username)
            if (user === null) return;
            const password = req.body.password || user.Password;
            const name = req.body.name;
            const email = req.body.email;
            const u = new Account(username, password, name, email);
            const rs = await User.Update(u);
            res.status(200).send(rs);
        } catch (error) {
            next(error);
        }
    },
    updatePage: async (req, res, next) => {
        try {
            const userName = req.params.username;
            const rs = await Account.Get(userName);
            res.render('updateUser', {
                user: rs,
                //passWord: pass,
                css: () => 'css/update',
                js: () => 'js/editUser'
            })
        } catch (error) {
            next(error)
        }
    }
}