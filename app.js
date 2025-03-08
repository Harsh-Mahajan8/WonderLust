if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const Listing = require("./models/listing")

//session
const sessionOpt = {
    secret : "thisisasecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
};
//using session
app.use(session(sessionOpt));  
app.use(flash());//flash    
 
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//errorHangling Imports
const expressError = require("./util/expressError.js");
//routes
const listingRoute = require('./routes/listings.js');
const reviewRoute = require('./routes/review.js');
const userRoute = require('./routes/user.js');

//setting ejs and parsing data
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);

//override
const override = require('method-override');
app.use(override('_method'));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}
app.use(express.static(path.join(__dirname,"/public")));
main().then((res) => {console.log('db is connectied')})
.catch((err) =>{console.log('error in connection server',err)});

app.listen(8080, (req,res) => {
    console.log("server is working at 8080");
})
//demo
app.get('/demo',async (req,res) => {
    let demoUser = new User({
        email : "demoUser@gmail.com",
        username : "demoUser"
    });
    let result = await User.register(demoUser,'demoPassword');
    res.send(result);
})

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use("/listings",listingRoute);
app.use("/listings/:id/review",reviewRoute);
app.use("/",userRoute);

//filters
app.get('/filters/:cat',async (req, res) => {
    let {cat} =  req.params;
    console.log(cat)
    let filterListings = await Listing.find({'category': cat});
    console.log(filterListings);
    res.render('listings/filter.ejs',{filterListings});
})
//search
app.get('/search',async (req,res) => {
    let {query} = req.query;
    let filterListings = await Listing.find({'Country':query});
    res.render('listings/filter.ejs',{filterListings});
})

 app.all('*', (req, res, next) => {
    throw new expressError(404,"Page not found!!");
})   
   
//error middleware
    app.use((err,req, res, next) => {
        let { status=500, message = "Somethingn went wrong" } = err;
        res.status(status);
        res.render('error.ejs', { message });
    })    
    

