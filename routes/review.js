const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../util/wrapAsync.js');
const Listing = require('../models/listing');
const Review = require('../models/review');
const {validateReview, isLoggedIn,isAuthor} = require('../middleware.js')



//review Route ->post request
router.post('/', validateReview,
    isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.name = req.user.username;
    review.owner = req.user._id;
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    console.log('review saved');
    req.flash('success','Review Added');
    res.redirect(`/listings/${id}`);
}));

//delete review route
router.delete('/:reviewId',isAuthor,
    isLoggedIn,wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log('review deleted');
    req.flash('success','Review Deleted');
    res.redirect(`/listings/${id}`);
}))

module.exports = router;
