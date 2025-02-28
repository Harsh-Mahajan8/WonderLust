const { date } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    name: String,
    comment: String,
    rating: {
        type: Number,
        max: 5,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('Review',reviewSchema);