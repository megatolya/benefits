'use strict';

var db = require('../../db');
var normalizer = require('../../db/normalizer');
var Q = require('q');

// TODO
function normalizeAchievement(achievement) {
    delete achievement._id;
    delete achievement.url;
    delete achievement.rules;
    return achievement;
}

module.exports = function (req, res, next) {
    var id = req.params.id;

    Q.all([
        db.achievements.get(req.params.id),
        normalizer.getParentAchievements(id),
        normalizer.getChildrenAchievements(id),
        normalizer.getAchievementHolders(id)
    ]).then(function (results) {
        var achievement = results[0];
        var parents = results[1];
        var children = results[2];
        var achievementHolders = results[3];

        var parentsPromises = Q.all(parents.map(function (parent) {
            return db.achievements.get(parent);
        }));
        var childrenPromises = Q.all(children.map(function (child) {
            return db.achievements.get(child);
        }));

        childrenPromises.then(function (children) {
            children = children.map(normalizeAchievement);

            parentsPromises.then(function (parents) {
                parents = parents.map(normalizeAchievement);

                Q.all(achievementHolders.map(function (uid) {
                    return db.users.get(uid);
                })).then(function (holders) {
                    achievement.parents = parents;
                    achievement.children = children;
                    achievement.holders = holders;
                    res.json(achievement);
                });
            }).fail(next);
        }).fail(next);

        normalizeAchievement(achievement);
    }).fail(next);
};
