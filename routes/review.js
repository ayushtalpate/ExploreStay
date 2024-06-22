const express=require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js");
const {validationReview,isLoggedin,isReviewAuthor}= require("../middleware.js");
const reviewController=require("../conroller/review.js");




//reviews
//post  rout
router.post("/", validationReview,isLoggedin,wrapAsync(reviewController.createReview ));
  
  //Delete review
  router.delete("/:reviewId", isLoggedin,isReviewAuthor ,wrapAsync(reviewController.deleteReview));

module.exports=router  
  