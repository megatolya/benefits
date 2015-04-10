'use strict';

var db = require('../../db');
var Q = require('q');
var auth = require('../../auth');
var console = require('../../console');

module.exports = function (req, res, next) {
    var provider = req.body.provider;
    var userData = req.body.userData;

    var dataToFind = {};
    var idFieldName = provider + 'Id';
    dataToFind[idFieldName] = userData[idFieldName];

    db.users.find(dataToFind)
        .then(res.json.bind(res))
        .fail(function () {
            auth.registerUser(userData)
                .then(res.json.bind(res))
                .fail(next);
        });
};
