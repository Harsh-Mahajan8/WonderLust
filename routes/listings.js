const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const Listing = require('../models/listing');
const {isLoggedIn ,isOwner,validateListing} = require('../middleware.js');

//validateListing


//index route
router.get('/', wrapAsync ( async (req,res) => {
    console.log("listing route");
    let allListing =await Listing.find({});
    console.log('index route working');
    res.render('listings/index.ejs',{allListing});
}));


//add button
router.get('/new',isLoggedIn, (req,res) => {
    console.log('add btn working');
    res.render('listings/new.ejs');
})

//post route
router.post('/', validateListing, wrapAsync(async (req,res, next) => {
        console.log(req.body);
        let newListing = new Listing(req.body);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash('success','New Listing Added');
        console.log('post route working');
        res.redirect('/listings');
}))

//update btn
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(async (req,res) => {
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
    if(!data){
        req.flash('error','Cannot find that listing');
        return res.redirect('/listings');
    }
    req.flash('success','Listing Updated');
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete('/:id',isLoggedIn,isOwner,wrapAsync (async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res)=>{console.log('Listing Deleted')}).catch((err) => {console.log('err in deleting route')});
    req.flash('success','Listing Deleted');
    res.redirect('/listings');
}));

//show route
router.get("/:id",wrapAsync (async (req,res) => {
    let  id  = req.params.id;
    console.log(id);
    let listingData = await Listing.findById(id).populate('reviews').populate('owner');
    // console.log(listingData);
    if(!listingData){
        req.flash('error','Cannot find that listing');
        return res.redirect('/listings');
    }
    console.log('show route working');
    res.render('listings/show.ejs', { listingData });
}));
module.exports = router;
