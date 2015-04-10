'use strict';

var db = require('./');
var Q = require('q');

var parentToChildren = {};
var childrenToParent = {};

var normalized = {};

module.exports = {
    getParentAchievements: function (id) {
        var deferred = Q.defer();

        if (!normalized.achievements) {
            this.normalizeAchievements().then(function () {
                deferred.resolve(childrenToParent[id] || []);
            }, deferred.reject);

            return deferred.promise;
        }

        deferred.resolve(childrenToParent[id] || []);

        return deferred.promise;
    },

    getChildrenAchievements: function (id) {
        var deferred = Q.defer();

        if (!normalized.achievements) {
            this.normalizeAchievements().then(function () {
                deferred.resolve(parentToChildren[id] || []);
            }, deferred.reject);

            return deferred.promise;
        }

        deferred.resolve(parentToChildren[id] || []);

        return deferred.promise;
    },

    normalizeAchievements: function () {
        var deferred = Q.defer();

        db.achievements.getAll().then(function (achievements) {
            parentToChildren = {};
            childrenToParent = {};

            achievements.forEach(function (achievement) {
                if (achievement.parent) {
                    parentToChildren[achievement.parent] = [achievement.id];
                    childrenToParent[achievement.id] = childrenToParent[achievement.id] || [];
                    childrenToParent[achievement.id].push(achievement.parent);
                }
            });

            normalized.achievements = true;
            deferred.resolve();
        }).fail(deferred.reject);

        return deferred.promise;
    }
};
