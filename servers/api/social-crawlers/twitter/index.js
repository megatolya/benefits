'use strict';

var debug = require('debug')('app:twitter-crawler');
var Twit = require('twit');
var config = require('../../../config');
var twitterConfig = config.providers.twitter;
var profileChecker = require('./profile-checker');

module.exports = {
    crawl: function (user) {
        var api = this._createApiInstance(user);
        debug('Start crawling for user: ', user.id);
        profileChecker.check(user);
        this._checkTweets(api, user);
    },

    _createApiInstance: function (user) {
        return new Twit({
            consumer_key: twitterConfig.key,
            consumer_secret: twitterConfig.secret,
            access_token: user.twitterData.accessToken,
            access_token_secret: user.twitterData.refreshToken
        });
    },

    _checkTweets: function (api, user) {
    }
};
