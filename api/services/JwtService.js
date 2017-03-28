var jwt = require('jsonwebtoken');

/**
 * Returns a promise when a payload is passed. if successful, promise contains a new token
 */
module.exports.issueToken = function (payload, user) {
  return new Promise((resolve, reject) => {
    jwt.verify(user.token, sails.config.jsonWebToken.token_secret, sails.config.jsonWebToken.options, function (err, decoded) {
      if (err) {//if the stored token is invalid, or expired
        //request for a new one
        jwt.sign(payload, sails.config.jsonWebToken.token_secret, sails.config.jsonWebToken.options, function (err, token) {
          if (err) reject(err);
          User.update({ id: user.id }, { token: token }).then(data => resolve(token)).catch(error => reject(error))
        });
      } else {//if its still valid and not expired
        resolve(user.token);
      }
    });
  });
};



/**
 * Returns a promise after verifing the token passed to it. If successful promise contains decoded payload
 */
module.exports.verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, sails.config.jsonWebToken.token_secret, sails.config.jsonWebToken.options, function (err, decoded) {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};


/**
 * Creates a new user
 */
module.exports.createUser = function (body) {
  return new Promise((resolve, reject) => {
    var newUser = {}

    if (sails.config.jsonWebToken.authType == "email") {
      // Validate request paramaters
      if (!body.email || !body.password) {
        reject('email or password parameter(s) missing')
      }

      newUser["email"] = body.email
    } else {
      // Validate request paramaters
      if (!body.username || !body.password) {
        reject('username or password parameter(s) missing')
      }

      newUser["username"] = body.username
    }


    //new user object
    var newUser = {
      password: body.password,
      active: sails.config.jsonWebToken.default_account_status
    };

    if (body.accountType) {
      newUser["accountType"] = body.accountType
    }

    User.create(newUser).then((user) => {
      resolve(user)
    }).catch((err) => {
      reject(err)
    });
  });
}