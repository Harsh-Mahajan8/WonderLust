const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

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
 
//errorHangling Imports
const expressError = require("./util/expressError.js");
//routes
const listing = require('./routes/listings.js');
const review = require('./routes/review.js');
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

//home route
app.get('/', (req, res) => {
    res.send('home route');
})

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use("/listings",listing);
app.use("/listings/:id/review",review);

 app.all('*', (req, res, next) => {
    throw new expressError(404,"Page not found!!");
})   
   
//error middleware
    app.use((err,req, res, next) => {
        let { status=500, message = "Somethingn went wrong" } = err;
        res.status(status);
        res.render('error.ejs', { message });
    })    
    

