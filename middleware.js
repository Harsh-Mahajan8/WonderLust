const Listing = require('./models/listing.js');
const Review = require("./models/review.js");
const expressError = require("./util/expressError.js");
const {listingSchema,reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.path = req.originalUrl;
        req.flash('error','You must log in first to create a Listing');
        return res.redirect('/login');
    }
    next();
}
module.exports.saveUrl =(req,res,next) =>{
    if(req.originalUrl){
        res.locals.pathUrl = req.session.path;
    }
    next();
}
module.exports.isOwner =async (req,res,next) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data.owner.equals(res.locals.currentUser._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing = ( req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expressError(400, error)
    }
    next();
}
module.exports.validateReview = ( req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400, error)
    }
    next();
}
module.exports.isAuthor =async (req,res,next) => {
    let {reviewId,id} = req.params;
    let data = await Review.findById(reviewId);
    if(!data.owner.equals(res.locals.currentUser._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/listings/${id}`);
    }
    next();
}