const express = require('express');
const router = express.Router();
// const User = require('../models/user.js');
const wrapAsync = require('../util/wrapAsync.js');
const passport = require('passport');
const {saveUrl} = require('../middleware.js');
const userController = require('../controller/user.js');

//Rendering new SignUp page
router.get('/signup', userController.renderSignUpPage);

//adding new user in db
router.post('/signup', wrapAsync(userController.addNewUser));

//login route
router.get('/login', userController.renderloginPage);

//checking user credentials
router.post('/login', saveUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}), wrapAsync(userController.checkingLoginCredentials));

//logout
router.get('/logout', userController.logout);

module.exports = router;
