'use strict';

var db = require('../db');
var config = require('../../config');
var auth = require('./');
var Q = require('q');

function checkToken(req, token, uid) {
    if (config.useToken === false) {
        return Q.resolve();
    }

    var deferred = Q.defer();

    var method = req.path.replace('/api/v1/', '');
    // находим пользователя, его соль, генерим токен и сравниваем
    db.users.get(uid)
        .then(function (user) {
            if (!user) {
                deferred.reject(new Error('User not found'));
                return;
            }

            var validToken = auth.generateToken(uid, user.salt, method);

            if (token === validToken) {
                deferred.resolve();
            } else {
                deferred.reject(new Error('Wrong token'));
            }
        })
        .fail(deferred.reject);

    return deferred.promise;
}

/*
module.exports = function (req, res, next) {
    var params = req.query;

    req.uid = params.uid;
    req.authorized = false;

    if (!params.token && config.useToken) {
        next();
        return;
    } else {
        checkToken(req, params.token, params.uid).then(function () {
            req.authorized = true;
            next();
        }).fail(function (reason) {
            next();
        });
    }
};
*/

module.exports = function (req, res, next) {
    next();
};
