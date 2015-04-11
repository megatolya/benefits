'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var authUtils = require('./utils');

var config = require('../../../config');
var facebookConfig = config.providers.facebook;

passport.use(
    new FacebookStrategy({
        clientID: facebookConfig.key,
        clientSecret: facebookConfig.secret,
        callbackURL: authUtils.getCallbackUrl(facebookConfig.name)
    }, onUserAccepted)
);

function onUserAccepted(accessToken, refreshToken, profile, done) {
    console.log('User accepted authorization from facebook');
    authUtils.finishAuth({
        provider: facebookConfig.name,
        userData: authUtils.createUserData(
            facebookConfig.name,
            profile,
            {accessToken: accessToken, refreshToken: refreshToken}
        )
    }, done);
}

module.exports = function (app) {
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate(
            'facebook',
            {successRedirect: '/', failureRedirect: '/login'}
        ));
};
