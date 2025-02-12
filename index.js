const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js')
const path = require('path');
const method = require('method-override');
const ejsMate = require("ejs-mate");
//setting ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(method('_method'));//override setup
app.engine('ejs',ejsMate);
//using static files
app.use(express.static(path.join(__dirname,"public")))


main().then((res) => {
    console.log('Server is working');
})
.catch((err)=> {console.log('error in db linking')});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}


app.listen(8080,(req,res) => {
    console.log('server is working at 8080');
})
app.get('/', (req, res) => {
    res.send('Home Page');
})


//index route
app.get('/listings', async (req,res) => {
    const listings = await Listing.find({});
    console.log('index route working');
    res.render('./listing/index.ejs',{listings});
})

//new listing
app.get('/listings/new', (req,res) => {
    res.render('listing/new.ejs');
})
//add new listing
app.post('/listings',async (req,res) => {
    let data = (req.body);
    let listing = new Listing(data);
    await listing.save();
    res.redirect('/listings');
})

//edit route
app.get('/listings/:id/edit',async (req,res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render('listing/update.ejs', {data});
})
//save edit
app.put('/listings/:id',async (req,res) => {
    let { id } = req.params;
    let data = req.body;
    console.log(data);
    await Listing.findByIdAndUpdate(id, data);
    console.log('updated');
    res.redirect('/listings/'+ id);
})
//show route
app.get('/listings/:id',async (req,res) => {
    let { id } = req.params;
    let listingData = await Listing.findById(id);
    res.render('listing/show.ejs',{listingData});
})

//delete route
app.delete('/listings/:id',async (req,res) => {
    let { id } = req.params;
    let listingData = await Listing.findByIdAndDelete(id);
    console.log(listingData);
    res.redirect('/listings');
})