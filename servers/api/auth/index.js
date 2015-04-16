'use strict';

var Q = require('q');
var db = require('../db');
var console = require('../console');
var uniq = require('../../common/uniq');
var md5 = require('MD5');
var _ = require('lodash');

module.exports = {
    registerUser: function (userData) {
        var deferred = Q.defer();

        userData = userData || {};
        userData.id = uniq();
        userData.salt = uniq();

        db.users.add(userData)
            .then(function () {
                deferred.resolve(userData);
                console.log('New user created', userData.id);
            })
            .fail(deferred.reject);

        return deferred.promise;
    },

    generateToken: function (uid, salt, method) {
        return md5(uid + '_' + salt + '_' + method);
    }
};
