const { date } = require('joi');
const mongoose = require('mongoose');
const schema = mongoose.schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        max: 5,
        min: 1
    },
    createdAt : {
        type: date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Review',reviewSchema);