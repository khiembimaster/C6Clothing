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
            console.log(rs);
            return rs;
        } catch (error) {
            next(error)
        }
    },
    add: async (req, res, next) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const name = req.body.name;
            const email = req.body.email;
            const permission = req.body?.permission || 1
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    return next(err);
                }
                const user = new Account(username, hash, name, email, permission);
                await Account.Add(user);
            })
            res.redirect('/admin/user')
        } catch (err) {
            next(err);
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
            if (!user) {
                return next();
            }

            const name = req.body.name || user.Username;
            const email = req.body.email || user.Email;
            const password = req.body.password;
            const permission = user.Permission
            if (password) {
                console.log(password)
                const compare = await bcrypt.compare(req.body.oldpassword, user.Password)
                if (!compare) {
                    return next();
                }
                bcrypt.hash(password, saltRounds, async function (err, hash) {
                    if (err) {
                        return next(err);
                    }
                    const user = new Account(username, hash, name, email, permission);
                    const rs = await User.Update(user);
                    req.login(user, function (err) {
                        if (err) { return next(err); }
                        res.send('oke');
                    });
                })
            } else {
                const updated = new Account(username, user.Password, name, email, permission);
                const rs = await User.Update(updated);
                res.send('oke');
            }
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
    },
    payment: async (req, res, next) => {
        console.log("OK");
        const money = req.body.money;
        console.log(req.session.passport.user.wallet);
        const refreshToken = req.session.passport.user.wallet;
        const email = req.session.passport.user.email;
        const params = {
            token: refreshToken
        }
        const response = await fetch('https://localhost:5000/wallet/refreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        const data = await response.json();
        console.log(data.accessToken);
        const accessToken = data.accessToken;
        const body = {
            balance: -money
        }
        const result = await fetch(`https://localhost:5000/wallet/${email}/payment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        console.log(result.data);
    }
}