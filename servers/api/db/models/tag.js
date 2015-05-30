'use strict';

var sq = require('sequelize');
var models = require('../models');

module.exports = [
    'tag',
    {
        id: {type: sq.INTEGER, primaryKey: true, autoIncrement: true},
        type: {type: sq.STRING},
        name: {type: sq.STRING, unique: true, allowNull: false}
    },
    {
        classMethods: {
            findAchievements: function (tagName) {
                return models.Tag.scope('withAchievements').find({
                    where: {name: tagName}
                }).then(function (tag) {
                    return tag.get('achievements');
                });
            }
        },

        defaultScope: {},
        scopes: {
            withAchievements: function () {
                return {
                    include: [{
                        model: models.Achievement,
                        include: [
                            {model: models.Rule}
                        ]
                    }]
                };
            }
        }

    }

];
