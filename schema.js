const joi = require('joi');

module.exports.listingSchema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.string().allow("", null),
        category: joi.string(),
});

module.exports.reviewSchema = joi.object({
        review : joi.object({
                comment: joi.string().required(),
                rating: joi.string().required().min(1).max(5),
        }).required()
});