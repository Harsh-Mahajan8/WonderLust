const express = require('express');
const router = express.Router();
// const User = require('../models/user.js');
const wrapAsync = require('../util/wrapAsync.js');
const passport = require('passport');
const {saveUrl} = require('../middleware.js');
const userController = require('../controller/user.js');

router.route('/signup')
    .get(userController.renderSignUpPage)//Rendering new SignUp page
    .post( wrapAsync(userController.addNewUser));//adding new user in db


router.route('/login')
    .get(userController.renderloginPage)//login route
    .post(saveUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}), wrapAsync(userController.checkingLoginCredentials));//checking user credentials

//logout
router.get('/logout', userController.logout);

module.exports = router;
