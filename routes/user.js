const express=require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../conroller/user.js");



router.route("/signup")
.get(userController.signupRoute) //signup form
.post(wrapAsync(userController.createUser ));//create new user

router.route("/login")
.get(userController.loginRoute)//login form route

.post(
    saveRedirectUrl,
    passport.authenticate('local',
        {failureRedirect:'/login',
         failureFlash:true}),
         userController.login
);//login

router.get("/logout",userController.logout)

module.exports= router;