'use strict';

var db = require('../../db');

module.exports = function (req, res, next) {
    db.achievements.add(req.body).then(function () {
        res.status(201);
        res.end();
    }, next);
};
