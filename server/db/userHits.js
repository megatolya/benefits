'use strict';

var Q = require('q');
var utils = require('./utils');

module.exports = {
    update: function (uid, trackData) {
        console.log('New trackData ', trackData, 'from uid', uid);
        var deferred = Q.defer();

        utils.getDatabase('userHits').then(function (db) {
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

    get: function (uid) {
        var deferred = Q.defer();

        utils.getDatabase('userHits').then(function (db) {
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
    }
};
