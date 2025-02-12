const mongoose = require('mongoose');
const schema = mongoose.Schema();

const listingSchema = new mongoose.Schema({
    title:{type: String, required: true},
    description:{type: String},
    price: {type: Number},
    location:{type: String},
    image:{
        type: String,
        default :'https://images.unsplash.com/photo-1739106288228-675e41bf58a9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        // set : (v) => v === " "?'https://images.unsplash.com/photo-1739106288228-675e41bf58a9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D':v,
    },
    country:{type: String}
})

const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;