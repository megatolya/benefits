'use strict';

var sq = require('sequelize');
var models = require('../models');
var Q = require('q');

module.exports = [
    'user',
    {
        id: {type: sq.INTEGER, primaryKey: true, autoIncrement: true},
        salt: {type: sq.STRING},
        name: {type: sq.STRING},

        twitterId: {type: sq.STRING},
        twitterData: {type: sq.JSONB},

        facebookId: {type: sq.STRING},
        facebookData: {type: sq.JSONB},

        githubId: {type: sq.STRING},
        githubData: {type: sq.JSONB},

        instagramId: {type: sq.STRING},
        instagramData: {type: sq.JSONB}
    },
    {
        classMethods: {
            findReceivedAchievements: function (uidToFind) {
                return models.User
                    .scope('withAchievements')
                    .find({
                        where: {id: uidToFind},
                        attributes: ['id']
                    }).then(function (user) {
                        return user.get('receivedAchievements');
                    });
            },

            getFullData: function (uid) {
                return Q.all([
                    models.User.scope('withAchievements').findById(uid),
                    this.findCreatedAchievements(uid)
                ]).spread(function (user, achievements) {
                    if (!user) {
                        return Q.reject(new Error('User not found'));
                    }

                    user.dataValues.createdAchievements = achievements;
                    return user;
                });
            },

            findCreatedAchievements: function (uid) {
                return models.Achievement.findAll({
                    where: {
                        creatorId: uid
                    }
                }).then(function (achievements) {
                    return achievements.map(function (achievement) {
                        return achievement.dataValues;
                    });
                });
            }
        },

        instanceMethods: {
            addAchievement: function (achievementId) {
                var achievements = this.receivedAchievements;

                if (achievements.indexOf(achievementId) !== -1) {
                    return Q.resolve();
                }

                achievements.push(achievementId);
                return this.setReceivedAchievements(achievements);
            },

            removeAchievement: function (achievementId) {
                var achievements = this.receivedAchievements;
                var index = achievements.indexOf(achievementId);

                if (index !== -1) {
                    return Q.resolve();
                }

                achievements.splice(index, 1);
                return this.setReceivedAchievements(achievements);
            }
        },

        defaultScope: {},
        scopes: {
            withAchievements: function () {
                return {
                    include: [{
                        model: models.Achievement, as: 'receivedAchievements',
                        include: [{model: models.Rule}]
                    }]
                };
            }
        }
    }
];
