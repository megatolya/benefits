'use strict';

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var userProvider = require('../../dataproviders/user');

var _ = require('lodash');
var authUtils = require('./utils');

var config = require('../../../config');

// TODO get this values from environment variables
var TWITTER_CONSUMER_KEY = 'xr3M1vwLGBRI91jgYqn4WKfYb';
var TWITTER_CONSUMER_SECRET = 'wNWTdK1x5fOUKeDXBTpMAbMPpJ2Oc9JE5V1Vbhwtw1gEpgDyt5';

var callbackUrl = 'http://localhost:3001/auth/twitter/callback';

passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: callbackUrl
    },

    function (token, tokenSecret, profile, done) {
        console.log('User accepted authorization');
        userProvider
            .put(config.providers.twitter, getUserDataFromProfile(profile))
            .then(function (user) {
                console.log('User saved', user.id);
                done(null, user);
            })
            .fail(done);
    }
));

function getUserDataFromProfile(profile) {
    return {
        twitterId: profile.id,
        twitterData: authUtils.cleanProfile(profile)
    };
}

module.exports = function (app) {
    app.get('/auth/twitter', passport.authenticate('twitter'));
    // Twitter will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/twitter/callback',
        passport.authenticate(
            'twitter',
            {successRedirect: '/', failureRedirect: '/login'}
        ));
};
