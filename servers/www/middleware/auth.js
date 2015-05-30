'use strict';

var config = require('../../config');
var debug = require('debug')('app:http');

module.exports = function (req, res, next) {
    var header = req.headers[config.uidHeader];

    req.fromExtension = Boolean(header);

    if (req.user) {
        debug(req.path + ' (authorized)');
    } else {
        debug(req.path + ' (not authorized)');
    }

    next();
};
