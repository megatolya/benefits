'use strict';

var debug = require('debug')('app:facebook-crawler');
var config = require('../../../config');
var profileChecker = require('./profile-checker');
var models = require('../../db/models');

var FACEBOOK_TAG_NAME = 'facebook';

module.exports = {
    crawl: function (user) {
        debug('Start crawling for user: ', user.id);
        this._getFacebookAchievements().then(function (achievements) {
            profileChecker.check(user, achievements);
        }.bind(this));
    },

    _getFacebookAchievements: function () {
        return models.Tag.findAchievements(FACEBOOK_TAG_NAME);
    }
};
