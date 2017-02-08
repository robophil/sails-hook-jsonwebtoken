/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcryptjs');

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true,
      minLength: 4
    },

    accountType: {
      type: 'string',
      defaultsTo: 'user'
    },

    active: {
      type: 'boolean',
      defaultsTo: true
    },

    token:{
      type: 'string',
      defaultsTo: 'token'
    },

    isPasswordValid: function (password, cb) {
      bcrypt.compare(password, this.password, cb);
    },

    // Override toJSON method to remove password from API
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: function (values, cb) {
    // Hash password
    bcrypt.hash(values.password, 10, function (err, hash) {
      if (err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  }
};