'use strict';

var Q = require('q');
var utils = require('./utils');

module.exports = {
    get: function (uid) {
        var deferred = Q.defer();

        utils.getDatabase('userAchievements').then(function (db) {
            var collection = db.collection(uid);

            collection.find({}, function (err, achievements) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                achievements.toArray(function (err, arr) {
                    if (err) {
                        deferred.reject(err);
                        return;
                    }

                    deferred.resolve(arr);
                });
            });
        }).fail(deferred.reject);

        return deferred.promise;
    },

    add: function (uid, achievements) {
        return Q.all(achievements.map(function (achivementId) {
            var deferred = Q.defer();

            utils.getDatabase('userAchievements').then(function (db) {
                var collection = db.collection(uid);

                collection.save({
                    id: achivementId,
                    date: Date.now(),
                    visible: true
                }, function (err, res) {
                    if (err) {
                        deferred.reject(err);
                        return;
                    }

                    deferred.resolve();
                });
            }).fail(deferred.reject);

            return deferred.promise;
        }));
    }
};
