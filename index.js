var _jsonWebToken = require('./lib/app.js');

module.exports = function jsonWebToken(sails) {
    _jsonWebToken.adaptSails(sails);
    return {
        defaults: {//#first. Set defaults to be used by your hook
            jsonWebToken: {
                token_secret: 'bless me father for i have sinned.....',
                options:{expiresIn: '2h'},
                email_activation: false,
                default_account_status: true,
                mailOptions: {},
                afterSignup: function (user) {
                    console.log("User account created")
                },
                afterSignin: function (user) {
                    console.log("successful login")
                },
                authType: "email" //could be {email or username}
            }
        },
        configure: function () {//#second. Called after defaults have been set.
            // sails.config[this.configKey].authMode = "default";
        },
        initialize: function (cb) {
            // Do some stuff here to initialize hook
            _jsonWebToken.init(sails);
            // And then call `cb` to continue
            return cb();
        }
    };
}