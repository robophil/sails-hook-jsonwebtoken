module.exports = function (req, res, next) {
    var token;

    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        //authorization: Bearer eyJhbGciOiJIUzI1NiIXVCJ9TJVA95OrM7E20RMHrHDcEfxjoYZgeFONFh7HgQ
        if (parts.length == 2) {
            var scheme = parts[0], credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {//is scheme is Bearer
                token = credentials;
            } else {
                token = false;
            }
        } else {
            return res.json(401, { err: { status: 'danger', message: 'wrong format in header. Check Authorization value' } });
        }
    } else if (req.param('token')) {
        token = req.param('token');
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    } else {
        return res.json(401, { err: { status: 'danger', message: 'No authorization header found' } });
    }

    JwtService.verifyToken(token).then((decoded) => {
        //add user id to the request object
        req.user_id = decoded.user_id;
    }).catch((err) => {
        return res.json(401, {
            err: {
                status: 'danger', message: 'could not validate token', error: err
            }
        });
    });
};