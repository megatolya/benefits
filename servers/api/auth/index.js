'use strict';

var Q = require('q');
var db = require('../db');
var console = require('../console');
var uuid = require('node-uuid');
var md5 = require('MD5');
var _ = require('lodash');

module.exports = {
    registerUser: function (userData) {
        var deferred = Q.defer();

        userData = userData || {};
        userData.id = uuid.v4();
        userData.salt = uuid.v4();

        db.users.add(userData)
            .then(function () {
                deferred.resolve(userData);
                console.log('new user created', userData);
            })
            .fail(deferred.reject);

        return deferred.promise;
    },

    generateToken: function (uid, salt, method) {
        return md5(uid + '_' + salt + '_' + method);
    }
};
