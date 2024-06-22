const User=require("../models/user.js");


module.exports.signupRoute=(req,res) => {
    res.render("users/signup.ejs");
}

module.exports.createUser=async (req,res,next) =>{
    try{
      let {username,email,password} = req.body;
      const newUser=new User({email,username});
      const regiserduser= await User.register(newUser,password);
      console.log(regiserduser);
      req.login(regiserduser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","You succefully Signup! Welcome to WanderLust");
        res.redirect("/listings");
      })
      
      
    }
    catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
    }
  }

module.exports.loginRoute=(req,res) => {
    res.render("users/login.ejs");
}

module.exports.login= async (req,res)=> {
    req.flash("success","Welcome back to Wanderlust! You logged in!");
    let redirectUrl= res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
 }
module.exports.logout = (req,res,next) => {
    req.logout((err)=>{
     if(err){
       next(err);
     }
     req.flash("success","You are logged out!");
     res.redirect("/listings");
    })
}