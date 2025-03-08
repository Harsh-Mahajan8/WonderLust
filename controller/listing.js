const Listing = require('../models/listing');
async function getCoordinates(location, country) {
    try {
      const opencage = require('opencage-api-client');
      const data = await opencage.geocode({
        q: `${location}, ${country}`,
        key: '827122d45a01487393d15893559c7665' // Replace with your actual OpenCage API key
      });
      
      if (data.results.length > 0) {
        const place = data.results[0];
        return place.geometry;
      } else {
        console.log('No results found');
        return null;
      }
    } catch (error) {
      console.log('Error fetching coordinates:', error.message);
      return null;
    }
  };

//index route
module.exports.index = async (req, res) => {
    console.log("listing route");
    let allListing = await Listing.find({});
    console.log('index route working');
    res.render('listings/index.ejs', { allListing });
}

//rendering add new listing form
module.exports.newListing = (req, res) => {
    res.render('listings/new.ejs');
}
module.exports.saveListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body);
    newListing.image = { url, filename };
    newListing.owner = req.user._id;
    res.locals.location = newListing.location;
    console.log(res.locals.location);

    let {lat, lng} = await getCoordinates(newListing.location, newListing.country);
    newListing.coordinates = [lat, lng];

    await newListing.save(); 
    console.log(newListing);
    req.flash('success', 'New Listing Added');
    console.log('post route working');
    res.redirect('/listings');
};
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    let orgUrl = data.image.url;
    let finalUrl = orgUrl.replace('/upload', '/upload/w_200');
    console.log('update btn working');
    res.render('listings/edit.ejs', { data, finalUrl });
};

module.exports.saveUpdate = async (req, res) => {
    let { id } = req.params;
    console.log("Update saved");
    let data = await Listing.findByIdAndUpdate(id, req.body );
    
    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        data.image = { url, filename };
        await data.save();
    }
    req.flash('success', 'Listing Updated');
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res) => { console.log('Listing Deleted') }).catch((err) => { console.log('err in deleting route') });
    req.flash('success', 'Listing Deleted');
    res.redirect('/listings');
}

module.exports.showListing = async (req, res) => {
    let id = req.params.id;
    console.log(id);
    let listingData = await Listing.findById(id).populate('reviews').populate('owner');
    let {lat, lng} = await getCoordinates(listingData.location, listingData.country);
    listingData.coordinates = [lat, lng];
    // console.log(listingData);
    if (!listingData) {
        req.flash('error', 'Cannot find that listing');
        return res.redirect('/listings');
    }
    console.log('show route working');
    res.render('listings/show.ejs', { listingData });
}
