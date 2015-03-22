'use strict';

var achievements = require('../../achievements');

module.exports = function (req, res, next) {
    if (!req.authorized) {
        next(401);
        return;
    }

    achievements.getUserAchivements(req.uid).then(function (achievements) {
        res.json({
            achievements: achievements.map(function (achievement) {
                delete achievement._id;
                return achievement;
            })
        });
    }).fail(next);
};
