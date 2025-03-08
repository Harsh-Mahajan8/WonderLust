const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controller/listing.js');
const multer = require('multer');
const {storage} = require('../cloudConfig');
const upload  = multer({storage});
    
router
    .route('/')
    .get(wrapAsync(listingController.index))//index route
    .post(isLoggedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.saveListing));//post route

//add button
router.get('/new', isLoggedIn, listingController.newListing);

router
    .route('/:id')
    .get( wrapAsync(listingController.showListing))//show route
    .put(isLoggedIn, upload.single("image"), validateListing, wrapAsync(listingController.saveUpdate))//save Update
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));//delete route

//update btn
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.updateListing));
//filter


module.exports = router;
