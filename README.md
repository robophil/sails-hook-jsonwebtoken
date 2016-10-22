# sails-hook-jsonwebtoken

A sails hook for easily using jsonwebtoken. It wraps around the popular [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

## install

```bash
npm install sails-hook-jsonwebtoken --save
```

## routes (sign up / sign in)

### signup

simply send post request here `POST /jwt/signup` containing the following parameters

```javascript
{
    email: '',
    password: '',//minimum length 6
    confirmPassword: ''//minimum lenght 6
}
```

returns object if successful

```javascript
{
    user: {id: '', email: '', active: true},//contains user object
    token: ''//token
}
```

### signin

simply send post request here `POST /jwt/auth` containing the following parameters

```javascript
{
    email: '',
    password: '',//minimum length 6
}
```

returns object if successful

```javascript
{
    user: {id: '', email: '', active: true},//contains user object
    token: ''//token
}
```

## policy

go to `config/policy.js` and apply the policy `JwtPolicy` to routes that needs authentication.
Visit sails doc [here](http://sailsjs.org/documentation/concepts/policies#?to-apply-a-policy-to-a-specific-controller-action) to learn more

```javascript
//example of how your file might look like
module.exports.policies = {
    '*': true,
    'RabbitController': {
        nurture : 'JwtPolicy',
        feed : ['isNiceToAnimals', 'JwtPolicy']
    }
}
```

## accessing a secure route

When acessing a route secured by policy, simple add token in Authorization header. See sample below where *token* is
`QWxhZGRpbjpPcGVuU2VzYW1l`

```html
Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l
```

or as parameter `token` in the request as shown below

```html
http://example.com?token=QWxhZGRpbjpPcGVuU2VzYW1l
```

## configuration

create config file `config/jsonWebToken.js`

```javascript
module.exports.jsonWebToken = {
    token_secret: 'bless me father for i have sinned.....',//token secret
    options:{}, // options to config node-jsonwebtoken
    default_account_status: true,//default account status
    email_activation: false, //if email activation is needed for every account created
    nodemailer:{// see https://github.com/nodemailer/nodemailer for options
        smtpTransport: "smtps://user%40gmail.com:pass@smtp.gmail.com",
        mailOptions: {//https://github.com/nodemailer/nodemailer#e-mail-message-fields
            from: '"Fred Foo" <foo@blurdybloop.com>', // sender address
            to: '', //this would be set at runtime for the current user trying to signup
            subject: 'Hello ✔', // Subject line
            text: 'Hello world', // plaintext body
            html: '<b>Hello world</b>' // html body
        },
        options: {},//https://github.com/nodemailer/nodemailer#set-up-smtp
        defaults: {}
    }
}
```

* see here for [options](https://github.com/auth0/node-jsonwebtoken#usage) settings
* see here for [nodemailer](https://github.com/nodemailer/nodemailer) options settings
* see here for [nodemailer.mailOptions](https://github.com/nodemailer/nodemailer#e-mail-message-fields) options settings
* see here for [nodemailer.options](https://github.com/nodemailer/nodemailer#set-up-smtp) options settings

## Note

`options.email_activation` and `options.nodemailer` have not been implemented yet.

## liscence

MIT License
