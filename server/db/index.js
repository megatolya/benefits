'use strict';

var Q = require('q');
var MongoClient = require('mongodb').MongoClient;
var config = require('../config');

var errors = Object.create(null);
var dbs = Object.create(null);
var connections = Object.create(null);
var deferreds = Object.create(null);

// http://stackoverflow.com/q/14495975
function getDatabase(dbName) {
    var deferred = Q.defer();

    if (dbName in dbs) {
        deferred.resolve(dbs[dbName]);
        return deferred.promise;
    }

    if (dbName in errors) {
        deferred.reject(errors[dbName]);
        return deferred.promise;
    }

    var dbDeferreds = deferreds[dbName] = deferreds[dbName] || [];

    dbDeferreds.push(deferred);

    if (dbName in connections) {
        dbDeferreds.push(deferred);
        return deferred.promise;
    }

    connections[dbName] = true;
    MongoClient.connect(config.db[dbName].connectionUrl, function (err, db) {
        if (err) {
            dbDeferreds.forEach(function (deferred) {
                deferred.reject(err);
            });
            errors[dbName] = err;
            return;
        }

        dbs[dbName] = db;
        dbDeferreds.forEach(function (deferred) {
            deferred.resolve(db);
        });
    });

    return deferred.promise;
}

module.exports = {
    appendUserData: function (userId, log) {
        console.log('Appending ', log, 'from userId', userId);
        var deferred = Q.defer();

        getDatabase('dumps').then(function (db) {
            var collection = db.collection(userId);

            collection.insert(log, function (err, results) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                db.close();
                deferred.resolve();
            });
        }).fail(deferred.reject);

        return deferred.promise;
    },

    addUser: function (userId, salt) {
        var deferred = Q.defer();

        getDatabase('users').then(function (db) {
            var collection = db.collection('userInfo');
            collection.insert({
                id: userId,
                salt: salt
            }, function (err, res) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                deferred.resolve();
            });
        }).fail(deferred.reject);

        return deferred.promise;
    },

    getUserByUserId: function (userId) {
        var deferred = Q.defer();

        getDatabase('users').then(function (db) {
            var users = db.collection('userInfo');
            users.findOne({id: userId}, function (err, user) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                deferred.resolve(user);
            });
        }).fail(deferred.reject);

        return deferred.promise;
    },

    addAchievement: function (achievement) {
        var deferred = Q.defer();

        getDatabase('achievements').then(function (db) {
            var collection = db.collection('browser');

            collection.insert(achievement, function (err, res) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                console.log('inserted', achievement.name);
                deferred.resolve(res);
            });
        });

        return deferred.promise;
    },

    getAllAchievements: function () {
        var deferred = Q.defer();

        getDatabase('achievements').then(function (db) {
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
    }
};
