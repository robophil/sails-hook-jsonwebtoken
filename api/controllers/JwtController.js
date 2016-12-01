var bcrypt = require('bcrypt');

module.exports = {
    login: function (req, res) {
        // Validate request paramaters
        if (!req.body.email || !req.body.password) {
            return res.json(400, {
                err: {
                    status: 'danger',
                    message: 'Email or password not found'
                }
            });
        }

        //find email matching user
        User.findOneByEmail(req.body.email).then((user) => {
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
                    JwtService.issueToken({ user_id: user.id }, user).then((token) => {
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

    signup: function (req, res) {
        // Validate request paramaters
        if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
            return res.json(400, {
                err: {
                    status: 'danger',
                    message: 'email, password or confirmPassword parameter(s) missing'
                }
            });
        }

        //TODO: Do some validation on the input
        if (req.body.password !== req.body.confirmPassword) {
            return res.json(400, {
                err: {
                    status: 'danger',
                    message: 'passwords do not match'
                }
            });
        }

        //new user object
        var newUser = {
            email: req.body.email,
            password: req.body.password,
            active: sails.config.jsonWebToken.default_account_status
        };

        User.create(newUser).then((user) => {
            JwtService.issueToken({ user_id: user.id }, user).then((token) => {
                return res.json({ user: user, token: token });
            }).catch((err) => {
                return res.serverError(err);
            });
        }).catch((err) => {
            return res.serverError(err);
        });
    }
};