'use strict';

var Q = require('q');

var MongoClient = require('mongodb').MongoClient;
var config = require('../config');

var errors = Object.create(null);
var dbs = Object.create(null);
var connections = Object.create(null);
var deferreds = Object.create(null);

// http://stackoverflow.com/q/14495975
module.exports = {
    getDatabase: function (dbName) {
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
};
