'use strict';

var db = require('../../db');

module.exports = function (req, res, next) {
    if (!req.authorized) {
        next(401);
        return;
    }

    db.userAchievements.get(req.uid).then(function (achievements) {
        res.json({
            achievements: achievements.map(function (achievement) {
                delete achievement._id;
                return achievement;
            })
        });
    }).fail(next);
};
