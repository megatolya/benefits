'use strict';

var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;

var config = require('../../../config');
var instagramConfig = config.providers.instagram;

var registerStrategy = require('./register-strategy');

registerStrategy({
    config: instagramConfig,
    strategy: InstagramStrategy
});

module.exports = function (app) {
    app.get('/auth/instagram', passport.authenticate('instagram'));
    app.get('/auth/instagram/callback',
        passport.authenticate(
            'instagram',
            {successRedirect: '/', failureRedirect: '/auth'}
        ));
};
