const express=require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const {isLoggedin,isOwner,validationListing}= require("../middleware.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({ storage })


const listingConroller=require("../conroller/listing.js");


router.route("/")
.get( wrapAsync(listingConroller.index))//route on listinng
.post(isLoggedin,

 upload.single('listing[image]'),
 validationListing,
 wrapAsync(listingConroller.createListing));  //create new route


 //create new listing form route
 router.get("/new", isLoggedin , listingConroller.renderNewForm);


 router.route("/:id")
 .get( wrapAsync( listingConroller.showListing))  //show route
 .put(isLoggedin,isOwner,upload.single('listing[image]'),validationListing,
  wrapAsync( listingConroller.updateListing))  //updated
 .delete(isLoggedin,isOwner,wrapAsync(listingConroller.deleteListing));//delete route


  //edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync( listingConroller.editListing));
  
  

  module.exports=router;