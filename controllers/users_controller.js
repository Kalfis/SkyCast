'use strict'
let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
// Define the rounds/iterations the bcrypt key setup phase uses
let SALT_WORK_FACTOR = 10;

let userSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
  created_at: Date,
  updated_at: Date,
  queries: []
})
// Before saving a password, make sure it is encrypted.
userSchema.pre('save', function(next) {
    let user = this;
    console.log(user);

  // hash the password only if it's new or has been modified
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password and the newly generated salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override cleartext password with hashed password
      user.password = hash;
      // console.log(user.password);
      next();
    });
  });
});

// Implement password verification
userSchema.methods.authenticate = function(password, callback) {
  // compare method that returns a boolean
  // Determine if the first argument once encrypted corres. to the second argument
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback( null, isMatch);

  });
};

let User = mongoose.model('User', userSchema);
module.exports = User;
