'use strict';

var sq = require('sequelize');
var models = require('../models');
var Q = require('q');

module.exports = [
    'achievement',
    {
        url: {type: sq.STRING},
        name: {type: sq.STRING, allowNull: false},
        description: {type: sq.TEXT},
        image: {type: sq.STRING}
    },
    {
        classMethods: {
            getFullData: function (achievementId) {
                return Q.all([
                    models.Achievement.scope('allRelations').findById(achievementId),
                    this.findParents(achievementId)
                ]).spread(function (achievement, parents) {
                    if (achievement) {
                        achievement.dataValues.parents = parents;
                    } else {
                        return Q.reject(new Error('Achievement not found'));
                    }

                    // FIXME так быть не должно
                    if (!achievement.creatorId) {
                        achievement.creator = null;
                        return achievement;
                    }

                    return this.getCreator(achievement.creatorId)
                        .then(function (creator) {
                            achievement.dataValues.creator = creator;
                            return achievement;
                        });
                }.bind(this));
            },

            findParents: function (achievementId) {
                return models.AchievementChild.findAll({
                    where: {childId: achievementId}
                }).then(function (parentChildRows) {
                    var ids = parentChildRows.map(function (row) {
                        return row.achievementId;
                    });
                    return models.Achievement.scope('allRelations').findAll({where: {id: ids}});
                }.bind(this));
            },

            getCreator: function (creatorId) {
                return models.User.findById(creatorId).then(function (creator) {
                    return creator.dataValues;
                });
            }
        },

        instanceMethods: {
            addChild: function (childId) {
                var children = this.children;
                if (children.indexOf(childId) !== -1) {
                    return Q.resolve();
                }

                children.push(childId);
                return this.setChildren(children);
            },

            removeChild: function (achievementId) {
                var children = this.children;
                var index = children.indexOf(achievementId);

                if (index !== -1) {
                    return Q.resolve();
                }

                children.splice(index, 1);
                return this.setChildren(children);
            }
        },

        defaultScope: {},
        scopes: {
            allRelations: function () {
                return {
                    include: [
                        {model: models.Achievement, as: 'children'},
                        {model: models.User, as: 'holders'},
                        {model: models.Tag},
                        {model: models.Rule},
                        {model: models.Certificate}
                    ]
                };
            }
        }
    }
];
