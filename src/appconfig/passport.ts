import * as pp from 'passport';
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user');
import * as appAuthConfig from './config';



export class PassportConfig {
    // module.exports = function (passport) {

    constructor(passport: pp.Passport, configs: appAuthConfig.AuthConfigSecrets) {

        this.setupUserSerialization(passport);
        this.setupLocal(passport);
        this.setupFacebook(passport, configs);
        this.setupGoogle(passport, configs);
        this.setupTwitter(passport, configs);

    }

    setupUserSerialization(passport: pp.Passport) {
        // ---------  passport session setup ------------
        // required for persistent login sessions
        // passport needs to serialize and deserialize users out of session
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });
    }

    setupLocal(passport: pp.Passport) {

        // 	//----------------------------LOCAL-----------------------
        // 	//  LOCAL SIGNUP
        // 	
        passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
            function(req, email, password, done) {
                process.nextTick(function() {
                    // if the user is not already logged in:
                    if (!req.user) {
                        User.findOne({ 'local.email': email }, function(err, user) {
                            // if there are any errors, return the error
                            if (err) {
                                return done(err);
                            }
                            console.log(user);
                            // check to see if theres already a user with that email
                            if (user) {
                                return done(null, { error: 'That email is already taken.' });
                            } else {

                                // create the user
                                var newUser = new User();

                                newUser.local.email = email;
                                newUser.local.password = newUser.generateHash(password);

                                newUser.save(function(err) {
                                    if (err) {
                                        throw err;
                                    }
                                    return done(null, newUser);
                                });
                            }

                        });
                        // if the user is logged in but has no local account...
                    } else if (!req.user.local.email) {
                        // ...presumably they're trying to connect a local account
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, user);
                        });
                    } else {
                        // user is logged in and already has a local account. Ignore signup. 
                        //(You should log out before trying to create a new account, user!)
                        return done(null, req.user);
                    }

                });

            }
        ));


        //  LOCAL LOGIN

        passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
            function(req, email, password, done) {
                // async
                // user.findOne won't fire unless data is sent back
                process.nextTick(function() {
                    // find a user for the email address
                    User.findOne({ 'local.email': email }, function(err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            return done(null, { error: 'No user found. ' });
                        }
                        if (!user.validPassword(password)) {
                            return done(null, { error: 'Incorrect password.' });
                        } else {
                            return done(null, user);
                        }
                    });
                });
            }
        ));
    }

    //---------------------FACEBOOK---------------------------
    setupFacebook(passport: pp.Passport, configs: appAuthConfig.AuthConfigSecrets) {
        passport.use(new FacebookStrategy({
            clientID: configs.facebook.client_ID,
            clientSecret: configs.facebook.client_secret,
            callbackURL: configs.facebook.callback_URL
        },

            //  facebook will send back the token and profile
            function(token, refreshToken, profile, done) {

                // async
                process.nextTick(function() {

                    // find the user
                    User.findOne({ 'facebook.id': profile.id }, function(err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (user) {
                            return done(null, user);
                        } else {
                            var newUser = new User();

                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.facebook.email = profile.emails[0].value;

                            newUser.save(function(err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, newUser);
                            });
                        }

                    });
                });
            }

        ));
    }

    // --------------------- TWITTER ------------------------
    setupTwitter(passport: pp.Passport, configs: appAuthConfig.AuthConfigSecrets) {
        passport.use(new TwitterStrategy({
            consumerKey: configs.twitter.consumer_key,
            consumerSecret: configs.twitter.consumer_secret,
            callbackURL: configs.twitter.callback_URL
        },
            function(token, tokenSecet, profile, done) {
                process.nextTick(function() {
                    User.findOne({ 'twitter.id': profile.id }, function(err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (user) {
                            return done(null, user);
                        } else {
                            var newUser = new User();

                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = token;
                            newUser.twitter.username = profile.username;
                            newUser.twitter.displayName = profile.displayName;

                            newUser.save(function(err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, newUser);
                            });
                        }
                    });
                });
            }
        ));

    }

    // ---------------------------- GOOGLE -------------------------
    setupGoogle(passport: pp.Passport, configs: appAuthConfig.AuthConfigSecrets) {
        passport.use(new GoogleStrategy({
            clientID: configs.google.client_ID,
            clientSecret: configs.google.client_secret,
            callbackURL: configs.google.callback_URL
        },
            function(token, refreshToken, profile, done) {
                process.nextTick(function() {
                    User.findOne({ 'google.id': profile.id }, function(err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (user) {
                            return done(null, user);
                        } else {
                            var newUser = new User();

                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value;

                            newUser.save(function(err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, newUser);
                            });
                        }
                    });
                });
            }
        ));
    }
};