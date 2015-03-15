var express = require('express');
var Q = require('q');
var uuid = require('node-uuid');
var db = require('./db');

express.request.getToken = function () {
    var req = this;
    var deferred = Q.defer();

    if (this.session.token) {
        deferred.resolve(this.session.token);
        return deferred.promise;
    }

    var token = uuid.v4();

    this.getUserIdFromToken().then(function(userId) {
        db.registerToken(token, userId).then(function () {
            req.session.token = token;
            deferred.resolve(token);
        }).fail(deferred.reject);
    });

    return deferred.promise;
};

express.request.getUserIdFromToken = function () {
    var deferred = Q.defer();

    console.log(this.session);
    if (!this.session.userId) {
        this.session.userId = uuid.v1();
    }

    console.log(this.session.userId);

    deferred.resolve(this.session.userId);

    return deferred.promise;
};
