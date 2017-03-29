# sails-hook-jsonwebtoken

A sails hook for easily using jsonwebtoken. It wraps around the popular [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

## install

```bash
npm install sails-hook-jsonwebtoken --save
```

1. [Routes](#routes-sign-up--sign-in)
    1. [Signup](#signup)
    1. [Signin](#signin)
1. [Secure a route](#policy)
1. [Accessing a secured route](#accessing-a-secure-route)
1. [Configure sails-hook-jsonwebtoken](#configuration)


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

go to `config/policies.js` and apply the policy `JwtPolicy` to routes that needs authentication.
Visit sails doc [here](http://sailsjs.org/documentation/concepts/policies#?to-apply-a-policy-to-a-specific-controller-action) to learn more

```javascript
//example of how your file might look like
module.exports.policies = {
    '*': 'JwtPolicy', //Secure all routes with jwtPolicy
    'JwtController': {
        '*': true//Make this open to allow for signup and authentication
    }
}
```

## accessing a secure route

When acessing a route secured by policy, simple add token in Authorization header. See sample below where *token* is
`QWxhZGRpbjpPcGVuU2VzYW1l`

```html
Authorization: Bearer QWxhZGRpbjpPcGVuU2VzYW1l
```

or as parameter `token` in the request as shown below

```html
http://example.com?token=QWxhZGRpbjpPcGVuU2VzYW1l
```

## configuration

create config file `config/jsonWebToken.js`

```javascript
module.exports.jsonWebToken = {
    token_secret: 'bless me father for i have sinned.....',
    options:{expiresIn: '2h'},
    default_account_status: true
}
```

* see here for [options](https://github.com/auth0/node-jsonwebtoken#usage) settings

## liscence

MIT License
