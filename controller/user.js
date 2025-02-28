const User = require('../models/user');

module.exports.renderSignUpPage = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.addNewUser = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        let user = new User({ email, username });
        let newUser = await User.register(user, password);
        req.login(newUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash('success', 'Welcome to WonderLust');
            res.redirect('/listings');
        })
        console.log(newUser);
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.renderloginPage = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.checkingLoginCredentials = async (req, res) => {
    req.flash('success', 'Welcome back to WonderLust');
    let redirectUrl = res.locals.pathUrl || '/listings';
    console.log(redirectUrl);
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are logged out');
        res.redirect('/listings');
    });
};
