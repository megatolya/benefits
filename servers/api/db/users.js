'use strict';

var Q = require('q');
var utils = require('./utils');
var _ = require('lodash');

module.exports = {
    add: function (userData) {
        var deferred = Q.defer();

        utils.getDatabase('users')
            .then(function (db) {
                var collection = db.collection('userInfo');

                collection.insert(userData, function (err, res) {
                    if (err) {
                        deferred.reject(err);
                        return;
                    }

                    deferred.resolve();
                });
            })
            .fail(deferred.reject);

        return deferred.promise;
    },

    get: function (uid) {
        return this.find({id: uid});
    },

    find: function (dataToFind) {
         var deferred = Q.defer();

        utils.getDatabase('users')
            .then(function (db) {
                var users = db.collection('userInfo');

                console.log('Find user by: ', dataToFind);

                users.findOne(dataToFind, function (err, user) {
                    if (err) {
                        deferred.reject(err);
                        return;
                    }

                    if (user) {
                        console.log('User found');
                        deferred.resolve(user);
                    } else {
                        console.log('User not found');
                        deferred.reject(null);
                    }
                });
            })
            .fail(deferred.reject);

        return deferred.promise;
    }
};
