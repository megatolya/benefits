'use strict';

var db = require('../../db');
var Q = require('q');
var _ = require('lodash');

module.exports = function (req, res, next) {
    var uid = req.params.uid;

    if (!uid) {
        console.log('not a uid: ', uid);
        res.status(400);
        return;
    }

    db.users.get(uid).then(function (user) {
        return db.userAchievements.get(user.id).then(function (userAchievements) {
            user.achievements = userAchievements;
            delete user.password;
            delete user.salt;

            return Q.all(userAchievements.map(function (userAchievement) {
                return db.achievements.get(userAchievement.id).then(function (achievement) {
                    _.assign(userAchievement, achievement);
                    delete userAchievement.rules;
                });
            })).then(function () {
                res.json(user);
            }).fail(next);
        }).fail(next);
    })
    .fail(next);
};
