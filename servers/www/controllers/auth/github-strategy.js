'use strict';

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var config = require('../../../config');
var gitHubConfig = config.providers.github;

var registerStrategy = require('./register-strategy');

registerStrategy({
    config: gitHubConfig,
    strategy: GitHubStrategy
});

module.exports = function (app) {
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback',
        passport.authenticate(
            'github',
            {successRedirect: '/', failureRedirect: '/auth'}
        ));
};
