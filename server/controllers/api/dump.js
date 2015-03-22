'use strict';

var achievements = require('../../achievements');

module.exports = function (req, res, next) {
    if (!req.authorized) {
        next(401);
        return;
    }

    res.sendStatus(202);
    res.end();

    achievements.trackDump(req.uid, req.body);
};
