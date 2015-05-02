'use strict';

var sq = require('sequelize');
var models = require('../models');

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
            findWithParents: function (achievementId) {
                return Promise.all([
                    models.Achievement.scope('allRelations').find(achievementId),
                    this.findParents(achievementId)
                ]).then(function (results) {
                    var achievement = results[0];
                    if (achievement) {
                        achievement.dataValues.parents = results[1];
                    }
                    console.log('achievements found: ');
                    return achievement;
                });
            },

            findParents: function (achievementId) {
                return models.AchievementChild.findAll({
                    where: {childId: achievementId}
                }).then(function (parentChildRows) {
                    var ids = parentChildRows.map(function (row) {
                        return row.achievementId;
                    });
                    console.log('finding parents: ');
                    return models.Achievement.scope('allRelations').findAll({where: {id: ids}});
                }.bind(this));
            }
        },

        instanceMethods: {},

        defaultScope: {},
        scopes: {
            allRelations: function () {
                return {
                    include: [
                        {model: models.Achievement, as: 'children'},
                        {model: models.User, as: 'holders'},
                        {model: models.Rule}
                    ]
                };
            }
        }
    }
];
