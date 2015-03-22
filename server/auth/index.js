'use strict';

var Q = require('q');
var db = require('../db');
var uuid = require('node-uuid');
var md5 = require('MD5');

module.exports = {
    registerUser: function () {
        var deferred = Q.defer();
        var id = uuid.v4();
        var salt = uuid.v4();

        db.users.add(id, salt).then(function () {
            var newUser = {
                id: id,
                salt: salt
            };

            deferred.resolve(newUser);
            console.log('new user created', newUser);
        }).fail(deferred.reject);

        return deferred.promise;
    },

    generateToken: function (uid, salt, method) {
        return md5(uid + '_' + salt + '_' + method);
    }
};
