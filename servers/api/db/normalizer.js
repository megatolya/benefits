'use strict';

var db = require('./');
var utils = require('./utils');
var Q = require('q');

var parentToChildren = {};
var childrenToParent = {};

var achievementToUsers = {};

var normalized = {};

module.exports = {
    getParentAchievements: function (id) {
        var deferred = Q.defer();

        if (!normalized.achievements) {
            this._normalizeAchievements().then(function () {
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
            this._normalizeAchievements().then(function () {
                deferred.resolve(parentToChildren[id] || []);
            }, deferred.reject);

            return deferred.promise;
        }

        deferred.resolve(parentToChildren[id] || []);

        return deferred.promise;
    },

    _normalizeAchievements: function () {
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
    },

    getAchievementHolders: function (id) {
        var deferred = Q.defer();

        if (!normalized.achievementHolders) {
            this._normalizeUserAchievements().then(function () {
                deferred.resolve(achievementToUsers[id] || []);
            }, deferred.reject);

            return deferred.promise;
        }

        deferred.resolve(achievementToUsers[id] || []);

        return deferred.promise;
    },

    _normalizeUserAchievements: function () {
        var ignoreCollection = 'system.indexes';
        var deferred = Q.defer();

        utils.getDatabase('userAchievements').then(function (database) {
            database.collectionNames(function (err, names) {
                Q.all(names.map(function (info) {
                    var name = info.name;

                    if (name === ignoreCollection) {
                        return Q.resolve();
                    }

                    return db.userAchievements.get(name).then(function (achievements) {
                        achievements.forEach(function (achievement) {
                            achievementToUsers[achievement.id] = achievementToUsers[achievement.id] || [];
                            achievementToUsers[achievement.id].push(name);
                        });
                        return Q.resolve();
                    });
                })).then(function () {
                    normalized.achievementHolders = true;
                    deferred.resolve();
                }, deferred.reject);
            });
        });

        return deferred.promise;
    }
};

module.exports._normalizeUserAchievements();
module.exports._normalizeAchievements();
