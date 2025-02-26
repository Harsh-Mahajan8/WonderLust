const flash = require('connect-flash');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash('error','You must log in first to create a Listing');
        return res.redirect('/login');
    }
    next();
}
