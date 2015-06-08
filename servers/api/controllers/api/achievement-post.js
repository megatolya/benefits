'use strict';

var _ = require('lodash');
var models = require('../../db/models');
var Q = require('q');

function getDiff(was, now) {
    var removed = [];
    var added = [];
    var all = _.uniq(was.concat(now));

    all.forEach(function (val) {
        if (was.indexOf(val) === -1) {
            added.push(val);
        }

        if (now.indexOf(val) === -1) {
            removed.push(val);
        }
    });

    return {
        removed: removed,
        added: added
    };
}

module.exports = function (req, res, next) {
    var id = req.params.id;

    models.Achievement.getFullData(id)
        .then(function (achievement) {
            function getId(obj) {
                return obj.id;
            }

            var parentsDiff = getDiff(achievement.dataValues.parents.map(getId), req.body.parents);
            var holdersDiff = getDiff(achievement.dataValues.holders.map(getId), req.body.holders);

            var parents = parentsDiff.added.map(function (parentId) {
                return models.Achievement.findById(parentId).then(function (parent) {
                    return parent.addChild(id);
                });
            }).concat(parentsDiff.removed.map(function (parentId) {
                return models.Achievement.findById(parentId).then(function (parent) {
                    return parent.removeChild(id);
                });
            }));
            var holders = holdersDiff.added.map(function (holderId) {
                return models.User.findById(holderId).then(function (holder) {
                    return holder.addAchievement(id);
                });
            }).concat(holdersDiff.removed.map(function (holderId) {
                return models.User.findById(holderId).then(function (holder) {
                    return holder.removeAchievement(id);
                });
            }));
            return Q.all(parents.concat([
                holders,
                achievement.update(req.body),
                achievement.setChildren(req.body.children)
            ]));
        })
        .then(res.sendStatus.bind(res, 200))
        .catch(next);
};
