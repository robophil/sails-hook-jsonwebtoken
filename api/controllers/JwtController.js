var bcrypt = require('bcryptjs');

module.exports = {
    /**
     * Controller action called when authenticating a user
     */
    auth: function (req, res) {
        var findCriteria = {}

        //Checks if email/username and password is found
        if (sails.config.jsonWebToken.authType == "email") {
            // Validate request paramaters. If email and password exist
            if (!req.body.email || !req.body.password) {
                return res.json(401, {
                    err: {
                        status: 'danger',
                        message: 'Email or password not found'
                    }
                });
            }

            findCriteria["email"] = req.body.email
        } else {
            // Validate request paramaters. If username and password exist
            if (!req.body.username || !req.body.password) {
                return res.json(401, {
                    err: {
                        status: 'danger',
                        message: 'Username or password not found'
                    }
                });
            }

            findCriteria["username"] = req.body.username
        }

        //find email matching user
        User.findOne(findCriteria).then((user) => {
            if (!user) {
                return res.json(401, {
                    err: {
                        status: 'warn',
                        message: 'User not found'
                    }
                });
            }

            //validate password (password, callback)
            user.isPasswordValid(req.body.password, function (err, match) {
                if (err) return res.serverError(err);
                if (match) {//issue a token to the user
                    JwtService.issueToken({ user_id: user.id, user_accountType: user.accountType }, user).then((token) => {
                        //call afterSignin function
                        sails.config.jsonWebToken.afterSignin(user)
                        return res.json({ user: user, token: token });
                    }).catch((err) => {
                        return res.serverError(err);
                    })

                } else {
                    return res.json(401, {
                        err: {
                            status: 'danger',
                            message: 'Invalid password'
                        }
                    });
                }
            });
        }).catch((err) => {
            return res.serverError(err);
        });
    },


    /**
     * Controller action called when signing up
     */
    signup: function (req, res) {
        JwtService.createUser(req.body).then(user => {
            JwtService.issueToken({ user_id: user.id, user_accountType: user.accountType }, user).then((token) => {
                //after signup function
                sails.config.jsonWebToken.afterSignup(user)
                return res.json({ user: user, token: token });
            }).catch((err) => {
                return res.json(401, {
                    err: {
                        status: 'danger',
                        message: 'Unable to create token for new account !!, account created'
                    },
                    message: err
                });
            });
        }).catch(err => {
            return res.json(400, {
                err: {
                    status: 'danger',
                    message: 'Unable to create account'
                },
                message: err
            });
        })
    }
};