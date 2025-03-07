const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review');

const listingSchema = new mongoose.Schema({
    title :{type:String},
    description :{type:String},
    image :{
        url : String,
        filename: String,
        },
    price : {type: Number},
    location :{type:String},
    country : {type:String},
    reviews:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    },] ,
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    coordinates:{
            type :[Number],
            required : true,               
    }
});

listingSchema.post('findOneAndDelete', async(listing)=> {
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;   