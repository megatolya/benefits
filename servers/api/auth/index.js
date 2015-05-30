'use strict';

var uniq = require('../../common/uniq');
var md5 = require('MD5');
var models = require('../db/models');
var debug = require('debug')('app:auth');

module.exports = {
    registerUser: function (userData) {
        userData = userData || {name: uniq()};
        userData.salt = uniq();

        return models.User.create(userData)
            .then(function (createdUser) {
                debug('new user created:', createdUser.get('name'));
                return createdUser;
            });
    },

    generateToken: function (uid, salt, method) {
        return md5(uid + '_' + salt + '_' + method);
    }
};
