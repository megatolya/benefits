'use strict';

var debug = require('debug')('app:github-crawler');
var config = require('../../../config');
var profileChecker = require('./profile-checker');
var models = require('../../db/models');

var GITHUB_TAG_NAME = 'github';

module.exports = {
    crawl: function (user) {
        debug('Start crawling for user: ', user.id);
        this._getGithubAchievements().then(function (achievements) {
            profileChecker.check(user, achievements);
        }.bind(this));
    },

    _getGithubAchievements: function () {
        return models.Tag.findAchievements(GITHUB_TAG_NAME);
    }
};
