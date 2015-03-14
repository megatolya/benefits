var express = require('express');
var Q = require('q');

express.request.getKey = function() {
    var deferred = Q.defer();

    console.log('getKey');

    deferred.resolve('uniqkey');

    return deferred.promise;
};
