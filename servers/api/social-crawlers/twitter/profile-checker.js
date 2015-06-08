'use strict';

var twitterRuleChecker = require('../../rule-checkers/twitter');
var debug = require('debug')('app:twitter-profile-crawler');

module.exports = {
    check: function (user, achievements) {
        this._checkFollowersCount(user, achievements);
    },

    _checkFollowersCount: function (user, achievements) {
        achievements.forEach(function (achievement) {
            achievement.rules.forEach(function (rule) {
                if (this._ruleSatisfied(user, rule)) {
                    this._addAchievement(user, achievement);
                }
            }, this);
        }, this);
    },

    _ruleSatisfied: function (user, rule) {
        return twitterRuleChecker.check(user.twitterData.specific, rule);
    },

    _addAchievement: function (user, achievement) {
        this._ifAchievementNewForUser(user, achievement, function () {
            user.addReceivedAchievements([achievement.id]);
            debug('achievement has been added: %s, %s', user.name, achievement.name);
        }.bind(this));
    },

    _ifAchievementNewForUser: function (user, achievement, callback) {
        var userAchievements = user.get('receivedAchievements') || [];
        for (var i = 0; i < userAchievements.length; i++) {
            if (userAchievements[i].id === achievement.id) {
                return;
            }
        }
        callback();
    }
};
