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
          User.update({id: user.id},{token: token}).then(data => resolve(token)).catch(error => reject(error))
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

module.exports.createUser = function (req){
  return new Promise ((resolve, reject) => {
        // Validate request paramaters
        if (!req.body.email || !req.body.password) {
            reject('email or password parameter(s) missing')
        }

        //new user object
        var newUser = {
            email: req.body.email,
            password: req.body.password,
            active: sails.config.jsonWebToken.default_account_status
        };

        if(req.body.accountType){
          newUser['accountType'] = req.body.accountType
        }

        User.create(newUser).then((user) => {
            resolve(user)
        }).catch((err) => {
            reject(err)
        });
  });
}