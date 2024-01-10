// middleware to test if authenticated
module.exports = function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    if (req.originalUrl.includes('admin'))
        res.redirect('/admin/signin');
    else
        res.redirect('back');
}

