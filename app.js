const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
//requireng models
const Listing = require('./models/listing');
const Review = require('./models/review');
const ejsMate = require('ejs-mate');
//errorHangling Imports
const wrapAsync = require('./util/wrapAsync.js');
const expressError = require("./util/expressError.js");
const joi = require('joi'); 
const {listingSchema} = require('./schema.js');
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
main().then((res) => {console.log('server is working')})
.catch((err) =>{console.log('error in connection server',err)});

app.listen(8080, (req,res) => {
    console.log("server is working");
})

//validateListing
const validateListing = ( req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expressError(400, error)
    }
    next()
}

//home route
app.get('/', (req, res) => {
    res.send('home route');
})

//index route
app.get('/listings',
    wrapAsync(async (req,res) => {
    console.log("listing route");
    let allListing =await Listing.find({});
    console.log('index route working');
    res.render('listings/index.ejs',{allListing});
}));


//add button
app.get('/listings/new', (req,res) => {
    console.log('add btn working');
    res.render('listings/new.ejs');
})

//post route
app.post('/listings', validateListing, wrapAsync(async (req,res, next) => {
        let newListing = new Listing(req.body);
        await newListing.save();
        console.log('post route working');
        res.redirect('/listings');
}))

//update btn
app.get('/listings/:id/edit',wrapAsync(async (req,res) => {
    let { id } = req.params;
    console.log(id);
    let data = await Listing.findById(id);
    console.log('update btn working');
    res.render('listings/edit.ejs',{data});
}));

//save Update
app.put('/listings/:id',validateListing,wrapAsync(async (req,res) => {
    let { id } = req.params;
    console.log(id);
    let updatedData = req.body;
    console.log("Update saved");
    let data = await Listing.findByIdAndUpdate(id,updatedData,{new:true});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete('/listings/:id',wrapAsync(async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res)=>{console.log('Listing Deleted')}).catch((err) => {console.log('err in deleting route')});
    res.redirect('/listings');
}));
 //review Route ->post request
    app.post('/listings/:id/review', async (req, res) => {
        let {id} = req.params;
        let listing = await Listing.findById(id);
        let review = new Review(req.body.review);
        listing.reviews.push(review);
        await listing.save();
        await review.save();
        console.log('review saved');
        res.redirect(`/listings/${id}`);
    })
//show route
app.get("/listings/:id",wrapAsync(async (req,res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId');
        return res.status(400).send('Invalid ID');
    }
    let listingData = await Listing.findById(id);
    if (!listingData) {
        console.log('Listing not found');
        return res.status(404).send('Listing not found');
    }
    console.log('show route working');
    res.render('listings/show.ejs', { listingData });
}));

    


    app.all('*', (req, res, next) => {
        throw new expressError(404,"Page not found!!");
    })
   

    //error middleware
    app.use((err,req, res, next) => {
        let { status=500, message = "Somethingn went wrong" } = err;
        // res.status(status).send(message);
        res.render('error.ejs', { message });
    })

