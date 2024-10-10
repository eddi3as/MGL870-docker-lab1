var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  username: String,
  password: String
});

/* METHODS NOT RECOGNIZED */
userSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/* METHODS NOT RECOGNIZED */
userSchema.methods.validate = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('user', userSchema);
module.exports = User;