'use strict';

var debug = require('debug')('crawls-giver');

module.exports = {
    checkRules: function (user, achievements, checkMethod) {
        achievements.forEach(function (achievement) {
            achievement.rules.forEach(function (rule) {
                if (checkMethod(user, rule)) {
                    this.addAchievementTo(user, achievement);
                }
            }, this);
        }, this);
    },

    addAchievementTo: function (user, achievement) {
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
