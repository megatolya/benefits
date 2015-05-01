'use strict';

var sq = require('sequelize');
var models = require('../models');

module.exports = [
    'user',
    {
        salt: {type: sq.STRING},
        name: {type: sq.STRING},

        twitterId: {type: sq.STRING},
        twitterData: {type: sq.JSONB},

        facebookId: {type: sq.STRING},
        facebookData: {type: sq.JSONB},

        githubId: {type: sq.STRING},
        githubData: {type: sq.JSONB}
    },
    {
        classMethods: {
            findReceivedAchievements: function (uidToFind) {
                return models.User
                    .scope('withAchievementsAndRules')
                    .find({
                        where: {id: uidToFind},
                        attributes: ['id']
                    }).then(function (user) {
                        return user.get('achievements');
                    });
            }
        },

        instanceMethods: {},

        defaultScope: {},
        scopes: {
            withAchievements: function () {
                return {
                    include: [{
                        model: models.Achievement
                    }]
                };
            },
            withAchievementsAndRules: function () {
                return {
                    include: [{
                        model: models.Achievement,
                        include: [{model: models.Rule}]
                    }]
                };
            }
        }
    }
];
