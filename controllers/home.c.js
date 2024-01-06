
module.exports = {
    homePage: (req, res, next) => {
        try {
            let user = null;
            if(req.session.passport){
                user = req.session.passport.user
            }
            
            res.render('homepage', {
                'user':  user,
                css:()=>'css/homepage',
                js:()=>'js/empty'
            })
        } catch (error) {
            next(error);
        }
    }
}
