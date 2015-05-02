'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    if (!req.authorized) {
        next(403);
        return;
    }

    models.User.findReceivedAchievements(req.uid)
        .then(function (achievements) {
            res.json({achievements: achievements});
        })
        .catch(next);
};
