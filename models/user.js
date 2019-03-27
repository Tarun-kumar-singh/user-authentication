const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

 const userSchema = mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String,
    unique:true
  },
  password: {
    type: String
  },
  userimage: {
    type: String,
    default:'default.png'
  },
  facebook:{type:String,default:''},
  fbtoken:Array,
  google:{type:String,default:''},
  googletooken:Array
});
 

 userSchema.methods.comparepassword = function(password) {
  return bcrypt.compareSync(password,this.password);
}
 module.exports = mongoose.model('User',userSchema);
