const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const expressError = require("../util/expressError.js");
const {listingSchema, reviewSchema} = require('../schema.js');
const Listing = require('../models/listing');

//validateListing
const validateListing = ( req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expressError(400, error)
    }
    next()
}

//index route
router.get('/', wrapAsync ( async (req,res) => {
    console.log("listing route");
    let allListing =await Listing.find({});
    console.log('index route working');
    res.render('listings/index.ejs',{allListing});
}));


//add button
router.get('/new', (req,res) => {
    console.log('add btn working');
    res.render('listings/new.ejs');
})

//post route
router.post('/', validateListing, wrapAsync(async (req,res, next) => {
        let newListing = new Listing(req.body);
        await newListing.save();
        console.log('post route working');
        res.redirect('/listings');
}))

//update btn
router.get('/:id/edit',wrapAsync(async (req,res) => {
    let { id } = req.params;
    console.log(id);
    let data = await Listing.findById(id);
    console.log('update btn working');
    res.render('listings/edit.ejs',{data});
}));

//save Update
router.put('/:id',validateListing ,wrapAsync (async (req,res) => {
    let { id } = req.params;
    console.log(id);
    let updatedData = req.body;
    console.log("Update saved");
    let data = await Listing.findByIdAndUpdate(id,updatedData,{new:true});
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete('/:id',wrapAsync (async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res)=>{console.log('Listing Deleted')}).catch((err) => {console.log('err in deleting route')});
    res.redirect('/listings');
}));

//show route
router.get("/:id",wrapAsync (async (req,res) => {
    let { id } = req.params;
    let listingData = await Listing.findById(id).populate('reviews');
    console.log('show route working');
    res.render('listings/show.ejs', { listingData });
}));
module.exports = router;