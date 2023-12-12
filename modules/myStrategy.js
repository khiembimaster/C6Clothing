const passport = require('passport');
const {Strategy} = require('passport-strategy');

module.exports = class MyStrategy extends Strategy{
    constructor(verify, options){
        super();
        this.name = 'myStrategy';
        this.verify = verify;
        this.username = (options && options.username) ? options.username : 'username';
        this.password = (options && options.password) ? options.password : 'password';
        passport.strategies[this.name] = this;
    }

    authenticate(req, options){
        const username = req.body[this.username];
        const password = req.body[this.password];
        this.verify(username, password, (err, user)=>{
            if(err){
                return this.fail(err);
            }
            if(user){
                return this.success(user, null);
            }
            this.fail('invalid auth');
        })
    }
}
