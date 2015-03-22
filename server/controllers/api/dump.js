'use strict';

var db = require('../../db');

module.exports = function (req, res, next) {
    if (!req.authorized) {
        next(401);
        return;
    }

    res.sendStatus(202);
    res.end();

    console.log('Got: ', req.body);

    var log = null;
    try {
        log = JSON.parse(req.body.log);
    } catch (err) {}

    if (!log) {
        console.error('Failed to parse log', req.body);
        return;
    }

    db.appendUserData(req.uid, log);
};
