'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var config = require('../../../config');
var facebookConfig = config.providers.facebook;

var registerStrategy = require('./register-strategy');

registerStrategy({
    config: facebookConfig,
    strategy: FacebookStrategy
});

module.exports = function (app) {
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate(
            'facebook',
            {successRedirect: '/', failureRedirect: '/auth'}
        ));
};
