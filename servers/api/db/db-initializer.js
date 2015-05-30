'use strict';

var db = require('./index');
var _ = require('lodash');
var debug = require('debug')('app:dev-data');

var models = require('./models');

var User = models.User;
var Achievement = models.Achievement;
var Rule = models.Rule;
var Hits = models.Hits;

module.exports = {
    initSchema: function (force) {
        debug('initializing db schema, force option:', force);
        return db.sync({force: force});
    },

    insertInitialData: function (data) {
        debug('inserting initial data %o', data);
        return Promise.all([
            this._createAchievements(data.achievements),
            this._createRules(data.rules),
            this._createUsers(data.users),
            this._createHits(data.hits)
        ]);
    },

    _createAchievements: function (achievements) {
        return Promise.all(achievements.map(function (ach) {
            var achDataToSave = _.extend({}, ach);
            delete achDataToSave.rules;
            return Achievement.create(achDataToSave)
                .then(this._addAchievementsRelations.bind(this, ach));
        }, this));
    },

    _addAchievementsRelations: function (achievementData, achievementModel) {
        return Promise.all([
            this._linkAchievementsWithRules(achievementData, achievementModel),
            this._addAchievementChildren(achievementData, achievementModel)
        ]);
    },

    _linkAchievementsWithRules: function (achievementData, achievementModel) {
        return achievementModel.setRules(achievementData.rules);
    },

    _addAchievementChildren: function (achievementData, achievementModel) {
        return achievementModel.setChildren(achievementData.children);
    },

    _createRules: function (rules) {
        return Promise.all(rules.map(function (rule) {
            return Rule.create(rule);
        }));
    },

    _createUsers: function (users) {
        return Promise.all(users.map(function (user) {
            var userToSave = _.extend({}, user);
            delete userToSave.achievements;
            return User.create(user)
                .then(this._linkUserWithAchievements.bind(this, user));
        }, this));
    },

    _linkUserWithAchievements: function (userData, userModel) {
        return userModel.setAchievements(userData.achievements);
    },

    _createHits: function (hits) {
        return Promise.all(hits.map(function (hit) {
            return Hits.create(hit);
        }));
    }
};
