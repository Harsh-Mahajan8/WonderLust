const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../util/wrapAsync.js');
// const Listing = require('../models/listing');
// const Review = require('../models/review');
const {validateReview, isLoggedIn,isAuthor} = require('../middleware.js');

const reviewController = require('../controller/review.js');

//review Route ->post request
router.post('/', validateReview,
    isLoggedIn, wrapAsync(reviewController.addReview));

//delete review route
router.delete('/:reviewId',isAuthor,
    isLoggedIn,wrapAsync(reviewController.destroyRoutes))

module.exports = router;
