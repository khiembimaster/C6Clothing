const Category = require('../models/category.m');
module.exports = {
    homePage: async (req, res, next) => {
        try {
            let user = null;
            if(req.session.passport){
                user = req.session.passport.user
            }
            
            const categories = await Category.All();
            res.render('homepage', {
                'user':  user,
                categories: categories,
                css:()=>'css/homepage',
                js:()=>'js/empty'
            })
        } catch (error) {
            next(error);
        }
    }
}
