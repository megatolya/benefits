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
    updateUserHits: function (uid, trackData) {
        console.log('New trackData ', trackData, 'from uid', uid);
        var deferred = Q.defer();

        getDatabase('userHits').then(function (db) {
            var collection = db.collection(uid);
            var toInsert = Object.keys(trackData);

            collection.find({
                rule_id: {
                    $in: toInsert.slice()
                }
            }, function (err, res) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                res.toArray(function (err, arr) {
                    if (err) {
                        deferred.reject(err);
                        return;
                    }

                    if (arr.length !== 0) {
                        var updatePromises = arr.map(function (row) {
                            // удаляем из toInsert то, что обновили
                            toInsert.splice(toInsert.indexOf(row.rule_id), 1);

                            var updateRecordsDeferred = Q.defer();

                            row.hits += trackData[row.rule_id];
                            collection.update({
                                _id: row._id
                            }, row, {upsert: false}, function (err, res) {
                                if (err) {
                                    updateRecordsDeferred.reject(err);
                                    return;
                                }

                                updateRecordsDeferred.resolve();
                            });

                            return updateRecordsDeferred;
                        });

                        Q.all(updatePromises)
                            .then(deferred.resolve)
                            .fail(deferred.reject);

                        if (toInsert.length === 0) {
                            return;
                        }
                    }

                    var insertPromises = toInsert.map(function (ruleId) {
                        var insertDeferred = Q.defer();

                        collection.insert({
                            rule_id: ruleId,
                            hits: trackData[ruleId]
                        }, function (err, res) {
                            if (err) {
                                insertDeferred.reject(err);
                                return;
                            }

                            insertDeferred.resolve();
                        });

                        return insertDeferred;
                    });

                    Q.all(insertPromises)
                        .then(deferred.resolve)
                        .fail(deferred.reject);
                });
            });
        }).fail(deferred.reject);

        return deferred.promise;
    },

    getUserHits: function (uid) {
        var deferred = Q.defer();

        getDatabase('userHits').then(function (db) {
            var collection = db.collection(uid);

            collection.find({}, {rule_id: true, hits: true}, function (err, trackData) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                trackData.toArray(function (err, arr) {
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

    getUserAchivements: function (uid) {
        var deferred = Q.defer();

        getDatabase('userAchivements').then(function (db) {
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

    addUser: function (uid, salt) {
        var deferred = Q.defer();

        getDatabase('users').then(function (db) {
            var collection = db.collection('userInfo');

            collection.insert({
                id: uid,
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

    getUserByUserId: function (uid) {
        var deferred = Q.defer();

        getDatabase('users').then(function (db) {
            var users = db.collection('userInfo');

            users.findOne({id: uid}, function (err, user) {
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

                console.log('inserted', achievement.id);
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
    },

    addUserAchivements: function (uid, achievements) {
        return Q.all(achievements.map(function (achivementId) {
            var deferred = Q.defer();

            getDatabase('userAchivements').then(function (db) {
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
