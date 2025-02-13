const mongoose = require('mongoose');
const inData = require('./data.js');
const Listing = require('../models/listing.js');

main().then((res) => {console.log('server is working')})
.catch((err) =>{console.log('error in connection server',err)});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust")
};

async function inDB(){
    await Listing.deleteMany({});
    await Listing.insertMany(inData.data);
    console.log('Data is saved');
}

inDB();
