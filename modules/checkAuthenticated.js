// middleware to test if authenticated
module.exports = function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('back');
}

