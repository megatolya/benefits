'use strict';

var config = require('../../config');
var debug = require('debug')('app:http');

module.exports = function (req, res, next) {
    var header = req.headers[config.uidHeader];

    req.fromExtension = Boolean(header);

    function goNext() {
        if (req.user) {
            debug(req.path + ' (authorized)');
        } else {
            debug(req.path + ' (not authorized)');
        }

        next();
    }

    if (req.query.aka) {
        var id = parseInt(req.query.aka, 10);
        req.getProvider('user').get(id).then(function (user) {
            req.user = user;
            goNext();
        }, next);
    } else {
        goNext();
    }
};
