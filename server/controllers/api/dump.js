'use strict';

var db = require('../../db');

module.exports = function (req, res, next) {
    if (!req.authorized) {
        next(401);
        return;
    }

    res.sendStatus(202);
    res.end();

    var log = null;
    try {
        log = JSON.parse(req.body.log);
    } catch (err) {}

    if (!log) {
        console.error('Failed to parse log', req.body.log);
        return;
    }

    db.appendUserData(req.uid, log);
};
