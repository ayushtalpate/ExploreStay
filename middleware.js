const Listing = require("./models/listing.js")
const Review=require("./models/review.js");
const {listingSchema , reviewSchema}=require("./schema.js");
const ExpressError =require("./utils/ExpressError.js");

module.exports.isLoggedin= (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You not authorize user! First login");
        res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl= (req,res,next) => {
  if (req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next();
};

module.exports.isOwner= async(req,res,next) => {
  let {id} = req.params;
  let listing= await Listing.findById(id);
  console.log
  if( !listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission edit the listing.")
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validationListing= (req,res,next) => {
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errmsg=error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
}

module.exports.validationReview = (req,res,next) => {
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errmsg=error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
}

module.exports.isReviewAuthor= async(req,res,next) => {
  let {reviewId,id} = req.params;
  let review= await Review.findById(reviewId);
  let currentUser=res.locals.currUser._id;
  console.log(review)
  if( !review.author.equals(currentUser)){
    req.flash("error","You did not create this review.")
    return res.redirect(`/listings/${id}`);
  }
  next();
}