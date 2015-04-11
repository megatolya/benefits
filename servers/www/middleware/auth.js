'use strict';

var config = require('../../config');

module.exports = function (req, res, next) {
    var header = req.headers[config.uidHeader];

    req.fromExtension = Boolean(header);

    if (req.user) {
        console.log(req.path, '(authorized)');
    } else {
        console.log(req.path, '(not authorized)');
    }

    next();
};
