const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
})
userSchema.plugin(mongooseLocalMongoose);
module.exports = mongoose.model('User',userSchema);