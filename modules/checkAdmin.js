module.exports = async function isAdmin(req, res, next) {
    console.log(req.session.passport.user)
    if (req.session.passport.user.permission == 2) {
        return next()
    }
    res.redirect('/')
}