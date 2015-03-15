var express = require('express');
var Q = require('q');
var db = require('./db');
var auth = require('./auth');

express.request.checkToken = function (token, uid) {
    var req = this;
    var deferred = Q.defer();

    // находим пользователя, его соль, генерим токен и сравниваем
    db.getUserByUserId(uid)
        .then(function (user) {
            if (!user) {
                deferred.reject(new Error('User not found'));
                return;
            }

            var validToken = auth.generateToken(uid, user.salt, req.path);
            console.log('validToken', validToken, 'vs token', token);

            if (token === validToken) {
                deferred.resolve();
            } else {
                deferred.reject(new Error('Wrong token'));
            }
        })
        .fail(deferred.reject);

    return deferred.promise;
};
