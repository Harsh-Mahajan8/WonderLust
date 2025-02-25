const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../util/wrapAsync.js');
const expressError = require("../util/expressError.js");
const {reviewSchema} = require('../schema.js');
const Listing = require('../models/listing');
const Review = require('../models/review');

//validating review
const validateReview = ( req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400, error)
    }
    next();
}

//review Route ->post request
router.post('/', validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    console.log('review saved');
    req.flash('success','Review Added');
    res.redirect(`/listings/${id}`);
}));

//delete review route
router.delete('/:reviewId',wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log('review deleted');
    req.flash('success','Review Deleted');
    res.redirect(`/listings/${id}`);
}))

module.exports = router;
