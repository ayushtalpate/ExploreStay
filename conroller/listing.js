const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.createListing=async (req,res) => {
 let coordinaate=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()

  
  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  newListing.geometry=coordinaate.body.features[0].geometry;
  let savedListing= await newListing.save();
  console.log(savedListing);
  req.flash("success","New Listing created...!")
  res.redirect("/listings")
 
}  
module.exports.index=async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
  }

module.exports.renderNewForm=(req,res) =>{
    res.render("listings/new.ejs")
  }
  
module.exports.showListing=async (req,res,next) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"},})
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested  it does not exsit...!");
      res.redirect("/listings")

    }
    res.render("listings/show.ejs",{listing});
  }



module.exports.editListing= async (req,res) => {
    
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested  it does not exsit...!");
      res.redirect("/listings")

    }

    let originalimage =listing.image.url;
    originalimage=originalimage.replace("/upload","/upload/h_300,w_250")

    res.render("listings/edit.ejs",{listing,originalimage});
  }

module.exports.updateListing=async (req,res) =>{
   
    let {id} = req.params;
    let listing= await Listing.findById(id);
    let listings=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !=="undefined"){
      let url=req.file.path;
    let filename=req.file.filename;
    listings.image={url,filename};
    await listings.save();
    }

    

    req.flash("success","Listing Updated...!")
    res.redirect(`/listings/${id}`);
  
  }

module.exports.deleteListing= async (req,res) =>{
    let {id} = req.params;
   let deletelisting= await Listing.findByIdAndDelete(id);
   //console.log(deletelisting);
   req.flash("success","Listing Deleted...!")
   res.redirect("/listings");
  }  
  