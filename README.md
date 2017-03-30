# sails-hook-jsonwebtoken

A sails hook for easily using jsonwebtoken. It wraps around the popular [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

## install

```bash
npm install sails-hook-jsonwebtoken --save
```

1. [Configure sails-hook-jsonwebtoken](#configuration)
1. [Applying policy for securing routes](#policy)
1. [Jwt open routes](#routes-sign-up--sign-in)
    1. [Signup](#signup)
    1. [Signin](#signin)
1. [Accessing a secured route](#accessing-a-secure-route)
1. [Using the JwtService](#service)
1. [Password reset](#password-reset)



## configuration

create config file `config/jsonWebToken.js` and update the defaults to suit your needs

```javascript
module.exports.jsonWebToken = {
    token_secret: 'i-am-a-secret-token',
    options:{expiresIn: '2h'}, //see below this section for more on `options`
    default_account_status: true,
    afterSignup: function (user) {
        console.log("User account created")
    },
    afterSignin: function (user) {
        console.log("successful login")
    },
    authType: "email" //could be {email or username}
}
```


* **token_secret** - your secret key used for generating token
* **options** - see here for [options](https://github.com/auth0/node-jsonwebtoken#usage) settings
* **default_account_status** - status of an account when created, if you need to do any other validation after account has been created set this to `false` then change to `true` when this is done. How you treat user account based on the status of this value is up to you
* **authType** - This could be `email` or `username`. Depending on your application needs
* **afterSignup** - This function is called every time a new account is created. The new `user` account created is passed to this function
* **afterSignin** - This function is called every time someone signs in. The `user` information is passed to the function



## policy

There are 3 policies that could be applied to secure your route. They are `JwtPolicy`, `UserIsAdminPolicy` and `UserIsUserPolicy`.

* `JwtPolicy` - Simply checks if the incoming request has the right authorization, the user exists and the token passed to it is still valid.

* `UserIsAdminPolicy` - Does exactly what the `JwtPolicy` does, but also checks if the accountType is of the type **admin**

* `UserIsUserPolicy` - Does exactly what the `JwtPolicy` does, but also checks if the accountType is of the type is **user**

### custom policy to valid another account type?

In real life scenerio, a user model `accountType` might be an **admin**, **user**, **customer** or any other account type that fits your need. 
Simply copy the content of `UserIsUserPolicy` and paste in a new file eg `policies/userIsCustomerPolicy.js`. Then change the value of `ACCOUNT_TYPE` to match your need. Eg `ACCOUNT_TYPE = "customer"` 

### Apply policy

go to `config/policies.js` and apply the policy you need to the secure your routes. 
Visit sails doc [here](http://sailsjs.org/documentation/concepts/policies#?to-apply-a-policy-to-a-specific-controller-action) to learn more

```javascript
//example of how your file might look like
module.exports.policies = {
    '*': 'UserIsUserPolicy', //Secure all routes with UserIsUserPolicy
    'JwtController': {
        '*': true// Make this open to allow for signup and authentication
    },
    'AdminController': {
        '*': 'UserIsAdminPolicy' //secure this route with UserIsAdminPolicy
    },
    'ProfileController': {
        'destroy': 'UserIsAdminPolicy' //only admin can delete a profile, secured with UserIsAdminPolicy
    }
} 
```


## Jwt routes (sign up / sign in)

### signup

depening on the value of `authType` in `config/jsonWebToken.js` that you created, whose value could be `email`, or `username`.

if `email`, simply send post request here `POST /jwt/signup` containing the following parameters.

```javascript
{
    email: '',
    password: '',//minimum length 4
    accountType: '' //if absent, defaults to *user*
}
```
if `username`, simply send post request here `POST /jwt/signup` containing the following parameters.

```javascript
{
    username: '',
    password: '',//minimum length 4
    accountType: '' //if absent, defaults to *user*
}
```

returns object if successful. **NOTE** (`email` or `username`) would be part of the object returned depending on your `authType`


```javascript
{
    user: {id: '', email: '', username: '', accountType: '', token: '', active: true},//contains user object
    token: ''//deprecated, would be removed soon
}
```

### signin

simply send post request here `POST /jwt/auth` containing the following parameters

if `email`

```javascript
{
    email: '',
    password: '',//minimum length 4
}
```

if `username`

```javascript
{
    username: '',
    password: '',//minimum length 4
}
```

returns object if successful. **NOTE**  (`email` or `username`) would be part of the object returned depending on your `authType`

```javascript
{
    user: {id: '', email: '', username: '', accountType: '', token: '', active: true},//contains user object
    token: ''//deprecated, would be removed soon
}
```


## Accessing a secure route

When acessing a route secured by policy, simple add token in Authorization header or through the route. See sample below where *token* is
`QWxhZGRpbjpPcGVuU2VzYW1l`

```html
Authorization: Bearer QWxhZGRpbjpPcGVuU2VzYW1l
```

or as parameter `token` in the request as shown below

```html
http://example.com?token=QWxhZGRpbjpPcGVuU2VzYW1l
```


## Using the JwtService

**JwtService.issueToken(payload, user)** - This returns a promise containing a token for the user passed to it. `payload` is the content to be passed into the token and `user` is the model object of the user you want to generate a token for

**JwtService.verifyToken(token)** - This returns a promise containing a decoded token if its still valid. `token` is the token you want to verify

**JwtService.createUser(body)** - This returns a promise containing the new user object created. `body` same as object sent during [Signup](#signup) above

**JwtService.getPasswordResetToken(email)** - This returns a promise containing a token that can be used for resetting the password for the `email` passed to the function

**JwtService.resetPassword(newpassword, token)** - This returns a promise containing a message when the password is successfully changed. `newpassword` is the new password for the account while `token` is the token generated for the email, see `JwtService.getPasswordResetToken(email)` to get a token.

## Changelog

See the different releases [here](https://github.com/Robophil/sails-hook-jsonwebtoken/releases)

## Liscence

MIT License
