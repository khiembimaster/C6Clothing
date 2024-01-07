const Account = require('../models/user.m')

module.exports = {
    getByID: async(res, req, next)=>{
        try {
            const userName = req.params.userName;
            const rs = Account.Get(userName);
            
        } catch (error) {
            
        }
    }
}