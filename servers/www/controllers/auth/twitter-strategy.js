'use strict';

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var authUtils = require('./utils');

var config = require('../../../config');
var twitterConfig = config.providers.twitter;

passport.use(
    new TwitterStrategy({
        consumerKey: twitterConfig.key,
        consumerSecret: twitterConfig.secret,
        callbackURL: authUtils.getCallbackUrl(twitterConfig.name)
    }, onUserAccepted)
);

function onUserAccepted(token, tokenSecret, profile, done) {
    console.log('User accepted authorization from twitter');
    authUtils.finishAuth({
        provider: twitterConfig.name,
        userData: authUtils.createUserData(
            twitterConfig.name,
            profile,
            {token: token, tokenSecret: tokenSecret}
        )
    }, done);
}

module.exports = function (app) {
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate(
            'twitter',
            {successRedirect: '/', failureRedirect: '/login'}
        ));
};
