var jwt = require('jsonwebtoken');

/**
 * Returns a promise when a payload is passed. if successful, promise contains a new token
 */
module.exports.issueToken = function (payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, sails.config.jsonWebToken.token_secret, sails.config.jsonWebToken.options, function (err, token) {
      if (err) reject(err);
      resolve(token);
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