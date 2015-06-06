'use strict';

var _ = require('lodash');
var models = require('../../db/models');
var Q = require('q');

module.exports = function (req, res, next) {
    var id = req.params.id;

    models.Achievement.find(id)
        .then(function (achievement) {
            var parents = req.body.parents.map(function (parentId) {
                return models.Achievement.find(parentId).then(function (parent) {
                    return parent.addChild(id);
                });
            });
            var holders = req.body.holders.map(function (holderId) {
                return models.User.find(holderId).then(function (holder) {
                    return holder.addAchievement(id);
                });
            });
            return Q.all(parents.concat([
                holders,
                achievement.update(req.body),
                achievement.setChildren(req.body.children)
            ]));
        })
        .then(res.sendStatus.bind(res, 200))
        .catch(next);
};
