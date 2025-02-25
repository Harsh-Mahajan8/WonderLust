const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../util/wrapAsync.js');
const passport = require('passport');
//home route
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});
router.post('/signup', wrapAsync(async (req, res) => {
   try{
        let { email, username, password } = req.body;
    let user = new User({ email, username });
    let newUser = await User.register(user, password);
    console.log(newUser);
    req.flash('success', 'Welcome to WonderLust');
    res.redirect('/listings');
   }catch(e){
       req.flash('error',e.message);
       res.redirect('/signup');
   }
}));

//login route
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});
router.post('/login',passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}), wrapAsync(async (req, res) => {
    req.flash('success', 'Welcome back to WonderLust');
    res.redirect('/listings');
}));
module.exports = router;