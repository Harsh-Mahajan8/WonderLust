const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review');

const listingSchema = new mongoose.Schema({
    title :{type:String},
    description :{type:String},
    image :{
        type : String,
        default :'https://plus.unsplash.com/premium_photo-1738779001459-3c2efd2f6e88?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        set : (v) => v ===""?'https://plus.unsplash.com/premium_photo-1738779001459-3c2efd2f6e88?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D': v,
        },
    price : {type: Number},
    location :{type:String},
    country : {type:String},
    reviews:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    },] 
});

listingSchema.post('findOneAndDelete', async(listing)=> {
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;   