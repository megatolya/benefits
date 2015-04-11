'use strict';

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var authUtils = require('./utils');

var config = require('../../../config');
var twitterConfig = config.providers.twitter;

var registerStrategy = require('./register-strategy');

registerStrategy({
    config: twitterConfig,
    strategy: TwitterStrategy,
    strategyOptions: {
        consumerKey: twitterConfig.key,
        consumerSecret: twitterConfig.secret,
        callbackURL: authUtils.getCallbackUrl(twitterConfig.name)
    }
});

module.exports = function (app) {
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate(
            'twitter',
            {successRedirect: '/', failureRedirect: '/auth'}
        ));
};
