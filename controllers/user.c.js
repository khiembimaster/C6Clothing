const User = require('../models/user.m')

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
            const name = req.params.id;
            const rs = await User.Get(name);
            return rs;
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const name = req.params.id;
            const rs = await User.Del(name);
            return rs;
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const name = req.params.id;
            const rs = await User.Update(name);
            return rs;
        } catch (error) {
            next(error);
        }
    }
}