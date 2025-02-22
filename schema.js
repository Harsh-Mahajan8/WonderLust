const joi = require('joi');

module.exports.listingSchema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.string().allow("", null),
});

module.exports.reviewSchema = joi.object({
        review : joi.object({
                name: joi.string().required(),
                comment: joi.string().required(),
                rating: joi.string().required().min(1).max(5),
        }).required()
});