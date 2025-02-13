const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing');
const ejsMate = require('ejs-mate');
app.engine('ejs',ejsMate);

app.listen(8080, (req,res) => {
    console.log("server is working");
})
//setting ejs
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
//override
const override = require('method-override');
app.use(override('_method'));

main().then((res) => {console.log('server is working')})
.catch((err) =>{console.log('error in connection server',err)});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}


//index route
app.get('/listings',async (req,res) => {
    let allListing =await Listing.find({});
    console.log('index route working');
    res.render('listings/index.ejs',{allListing});
})


//add button
app.get('/listings/new', (req,res) => {
    console.log('add btn working');
    res.render('listings/new.ejs');
})
//post route
app.post('/listings',async (req,res) => {
    let newListing = new Listing(req.body);
    await newListing.save().then((res) => {console.log(res)}).catch((err) => {console.log('err in saving data',err)});   
    console.log('post route working');
    res.redirect('/listings');
})
//update btn
app.get('/listings/:id/edit',async (req,res) => {
    let { id } = req.params;
    console.log(id);
    let data = await Listing.findById(id);
    console.log('update btn working');
    res.render('listings/edit.ejs',{data});
})
//save Update
app.put('/listings/:id',async (req,res) => {
    let { id } = req.params;
    console.log(id);
    let updatedData = req.body;
    console.log("Update saved");
    let data = await Listing.findByIdAndUpdate(id,updatedData,{new:true});
    res.redirect(`/listings/${id}`);
})
//delete route
app.delete('/listings/:id',async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res)=>{console.log('Listing Deleted')}).catch((err) => {console.log('err in deleting route')});
    res.redirect('/listings');
})

//show route
app.get("/listings/:id",async (req,res) => {
    let { id } = req.params;
    let listingData = await Listing.findById(id);
    console.log('show route working');
    res.render('listings/show.ejs',{listingData});
})