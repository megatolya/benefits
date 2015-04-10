'use strict';

var Q = require('q');
var utils = require('./utils');
var console = require('../console');
var uuid = require('node-uuid');

module.exports = {
    add: function (achievement) {
        var deferred = Q.defer();

        utils.getDatabase('achievements').then(function (db) {
            var collection = db.collection('browser');

            achievement.rules.forEach(function (rule) {
                rule.id = uuid.v4();
            });

            collection.insert(achievement, function (err, res) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                console.log('inserted', achievement.id);
                deferred.resolve(res);
            });
        });

        return deferred.promise;
    },

    getAll: function () {
        var deferred = Q.defer();

        utils.getDatabase('achievements').then(function (db) {
            var collection = db.collection('browser');

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
        });

        return deferred.promise;
    },

    get: function (id) {
        var deferred = Q.defer();

        utils.getDatabase('achievements').then(function (db) {
            var collection = db.collection('browser');

            collection.findOne({id: id}, function (err, achievement) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                if (achievement) {
                    deferred.resolve(achievement);
                } else {
                    deferred.reject();
                }
            });
        });

        return deferred.promise;
    }
};