'use strict';

var debug = require('debug')('app:twitter-crawler');
var Twit = require('twit');
var config = require('../../../config');
var twitterConfig = config.providers.twitter;
var profileChecker = require('./profile-checker');
var models = require('../../db/models');

var TWITTER_TAG_NAME = 'twitter';

module.exports = {
    crawl: function (user) {
        var api = this._createApiInstance(user);
        debug('Start crawling for user: ', user.id);
        this._getTwitterAchievements().then(function (achievements) {
            profileChecker.check(user, achievements);
            this._checkTweets(api, user, achievements);
        }.bind(this));
    },

    _createApiInstance: function (user) {
        return new Twit({
            consumer_key: twitterConfig.key,
            consumer_secret: twitterConfig.secret,
            access_token: user.twitterData.accessToken,
            access_token_secret: user.twitterData.refreshToken
        });
    },

    _getTwitterAchievements: function () {
        return models.Tag.findAchievements(TWITTER_TAG_NAME);
    },

    _checkTweets: function (api, user, achievements) {
    }
};
