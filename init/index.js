const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');

main().then((res) => {
    console.log('Server is working');
})
.catch((err)=> {console.log('error in db linking')});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}

async function createData(){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('Data was initialized')
}
createData();

