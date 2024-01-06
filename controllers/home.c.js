
module.exports = {
    homePage: (req, res, next) => {
        try {
            res.render('homepage', {
                css:()=>'css/homepage',
                js:()=>'js/empty'
            })
        } catch (error) {
            next(error);
        }
    }
}
