var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
var FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../config/secret');
// Serialze and  deserialize

passport.serializeUser(function(user,done){
done(null,user._id);
});


passport.deserializeUser(function(id,done){
User.findById(id,function(err,user) {
	done(err,user);
});
});



//Middleware
passport.use('local-login',new LocalStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback:true
}, function(req,email,password,done){
  User.findOne({email:email},function(err,user){
  	 if(err) return done(err);
     if (!user) {
      console.log('User is not found ');
      return done(null,false, console.log('User is not found'));
       }

    console.log(user.comparepassword(password));
     if(!user.comparepassword(password))
     {
      console.log('password did not match');
      return done(null,false,console.log('password not match'));
    }

      console.log('Successfully loged in ');
      return done(null,user);
   });
}));


passport.use(new FacebookStrategy(secret.facebook,function(token,refreshToken,profile,done){
  User.findOne({facebook:profile.id },function(err,user){
    if(err) return done(err);
    if (user) { return done(null,user); }
    else{
      const newuser = new User();
       newuser.email = profile._json.email;
       newuser.facebook = profile.id;
       newuser.fbtoken.push({kind:'facebook',token:token});
       newuser.username = profile.displayName;
       newuser.userimage = 'http://graph.facebook.com/'+ profile.id + '/picture?type=large';
       
       newuser.save(function(err){
        if (err) throw err; 
        return done(null,newuser);
       });
    } 
  });

}));


//Custom function to validate
exports.isAuthenticated = function(req,res,next){
	if (req.isAuthenticated()) { return next(); }
  res.redirect('/user/login');
}
