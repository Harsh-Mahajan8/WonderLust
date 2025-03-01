const Listing = require('../models/listing');
//index route
module.exports.index = async (req,res) => {
    console.log("listing route");
    let allListing = await Listing.find({});
    console.log('index route working');
    res.render('listings/index.ejs',{allListing});
}

//rendering add new listing form
module.exports.newListing = (req,res) => {
    res.render('listings/new.ejs');
}
module.exports.saveListing = async (req,res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"...",filename);
    let newListing = new Listing(req.body);
    newListing.image = { url, filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success','New Listing Added');
    console.log('post route working');
    res.redirect('/listings');
};
module.exports.updateListing = async (req,res) => {
    let { id } = req.params;
    console.log(id);
    let data = await Listing.findById(id);
    console.log('update btn working');
    res.render('listings/edit.ejs',{data});
};
module.exports.saveUpdate = async (req,res) => {
    let { id } = req.params;
    console.log(id);
    let updatedData = req.body;
    console.log("Update saved");
    let data = await Listing.findByIdAndUpdate(id,updatedData,{new:true});
    if(!data){
        req.flash('error','Cannot find that listing');
        return res.redirect('/listings');
    }
    req.flash('success','Listing Updated');
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res)=>{console.log('Listing Deleted')}).catch((err) => {console.log('err in deleting route')});
    req.flash('success','Listing Deleted');
    res.redirect('/listings');
}
module.exports.showListing = async (req,res) => {
    let  id  = req.params.id;
    console.log(id);
    let listingData = await Listing.findById(id).populate('reviews').populate('owner');
    // console.log(listingData);
    if(!listingData){
        req.flash('error','Cannot find that listing');
        return res.redirect('/listings');
    }
    console.log('show route working');
    res.render('listings/show.ejs', { listingData });
}
