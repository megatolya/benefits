'use strict';

var sq = require('sequelize');
var models = require('../models');

module.exports = [
    'user',
    {
        salt: {type: sq.STRING},
        name: {type: sq.STRING, allowNull: false},

        twitterID: {type: sq.STRING, unique: true},
        twitterData: {type: sq.JSON},

        facebookID: {type: sq.STRING, unique: true},
        facebookData: {type: sq.JSON},

        githubID: {type: sq.STRING, unique: true},
        githubData: {type: sq.JSON}
    },
    {
        classMethods: {
            findReceivedAchievements: function (uidToFind) {
                return models.User.find({
                    where: {id: uidToFind},
                    attributes: ['id'],
                    include: [{model: models.Achievement, include: [models.Rule]}]
                }).then(function (user) {
                    return user.get('achievements');
                });
            }
        },
        instanceMethods: {}
    }
];
