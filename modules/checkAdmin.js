module.exports = async function isAdmin(req, res, next) {
    if (req.session.passport.user.permission == 2) {
        return next()
    }
    res.redirect('/admin/signin')
}