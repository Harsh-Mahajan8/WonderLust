const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controller/listing.js');

router
    .route('/')
    .get(wrapAsync(listingController.index))//index route
    .post(validateListing, wrapAsync(listingController.saveListing));//post route

//add button
router.get('/new', isLoggedIn, listingController.newListing);

router
    .route('/:id')
    .get( wrapAsync(listingController.showListing))//show route
    .put( validateListing, wrapAsync(listingController.saveUpdate))//save Update
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));//delete route

    //update btn
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.updateListing));
module.exports = router;
