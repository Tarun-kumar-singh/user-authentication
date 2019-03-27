const express = require('express');
const app = express();
const home = require('./routes/home');
const bodyParser = require('body-parser');
const ejs = require('ejs');
var secret = require('./config/secret');
const user = require('./routes/user');
const mongoose = require('mongoose');
const passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongostore = require('connect-mongo')(session);
const fs = require('fs');
const path = require('path');


mongoose.connect('mongodb://localhost/chatapp',{ useNewUrlParser: true,useCreateIndex: true, })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.engine('ejs',engine);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
 app.use(session({
	resave:true,
	saveUninitialized:true,
	secret:"tarun",
	store: new mongostore({ url:secret.database,autoReconnect:true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});

app.use('/',home);
app.use('/user',user);



const port= 3000;
app.listen(port,()=> console.log(`Server is running on port ${port}...`))
