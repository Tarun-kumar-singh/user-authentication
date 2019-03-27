const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
var passport = require('passport');
const passportConfig = require('../config/passport');



router.get('/edit-profile', (req, res, next) => {
  res.render('edit-profile');
});





router.post('/edit-profile', (req, res, next) => {
      User.findOne({
          _id: req.user._id
        }, (err, user) => {
          if (err) return next(err);
          if (req.body.name) user.username = req.body.name;
          if (req.body.email) user.email = req.body.email;

          user.save();
          console.log("Profile edited successfully");
          return res.redirect('/user/edit-profile');

          });
      });







    router.get('/profile', (req, res, next) => {
     
     if (req.user){
               
               User.findOne({
        _id: req.user._id
      }, function(err, user) {
        if (err) {
          return next(err);
        }
        res.render('profile', {
          user: user
        });
      });
    }

    else{
      res.redirect('/user/login');
    }
        
      

    });

    router.get('/signup', (req, res) => {
      res.render('signup');
    });

    router.post('/login', passport.authenticate('local-login', {

      successRedirect: '/user/profile',
      failureRedirect: '/user/login',
      failureFlash: true

    }));

    router.post('/signup', async (req, res) => {

      let user = await User.findOne({
        email: req.body.email
      });

      if (user) {
        req.flash('errormessage', 'Account with the given email already exist.');
        console.log("User the given email already exist");
        return res.redirect('/user/signup');
      }

      user = new User();
      user.username = req.body.username;
      user.email = req.body.email;

      console.log(user.username);
      console.log(req.body.userpassword);

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.userpassword, salt);
      
      await user.save(function(err,user){
        
        if (err) return next(err);
        
        req.logIn(user,function(err){
          if(err) return next(err);
          res.redirect('/user/profile');
        })
      });
 
    });


    router.get('/login', (req, res) => {
      if (req.user) {
        return res.redirect('/user/profile');
      }
      res.render('login');
    });

    router.get('/logout', (req, res, next) => {
      req.logout();
      console.log('Logged out successfully ');
      res.redirect('/user/login');
    });



  router.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));

router.get('/auth/facebook/callback',passport.authenticate('facebook',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/login'
}));

    module.exports = router;
