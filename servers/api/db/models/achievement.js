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
            _byId: function (findType, achievementId) {
                return models.Achievement[findType]({
                    where: {id: achievementId},
                    include: [{model: models.Achievement, as: 'children'}, models.User, models.Rule]
                });
            },

            findWithParents: function (achievementId) {
                return Promise.all([
                    this._byId('find', achievementId),
                    this.findParents(achievementId)
                ]).then(function (results) {
                    var achievement = results[0];
                    if (achievement) {
                        achievement.dataValues.parents = results[1];
                    }
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
                    return this._byId('findAll', ids);
                }.bind(this));
            }
        }
    }
];
