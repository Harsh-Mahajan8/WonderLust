const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const {isLoggedIn ,isOwner,validateListing} = require('../middleware.js');
const listingController = require('../controller/listing.js');

//add button
router.get('/new', isLoggedIn, listingController.newListing );

//index route
router.get('/', wrapAsync ( listingController.index ));

//post route
router.post('/', validateListing, wrapAsync(listingController.saveListing));

//update btn
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.updateListing));

//save Update
router.put('/:id',validateListing ,wrapAsync (listingController.saveUpdate));

//delete route
router.delete('/:id',isLoggedIn,isOwner,wrapAsync (listingController.deleteListing));

//show route
router.get('/:id',wrapAsync (listingController.showListing));

module.exports = router;
