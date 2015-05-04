'use strict';

var db = require('./index');
var _ = require('lodash');
var debug = require('debug')('dev-data');

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
        var promises = [];
        achievements.forEach(function (ach) {
            var achDataToSave = _.extend({}, ach);
            delete achDataToSave.rules;
            promises.push(
                Achievement.create(achDataToSave)
                    .then(this._addAchievementsRelations.bind(this, ach))
            );
        }, this);
        return Promise.all(promises);
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
        var promises = [];
        rules.forEach(function (rule) {
            promises.push(Rule.create(rule));
        });
        return Promise.all(promises);
    },

    _createUsers: function (users) {
        var promises = [];
        users.forEach(function (user) {
            var userToSave = _.extend({}, user);
            delete userToSave.achievements;
            promises.push(
                User.create(user)
                    .then(this._linkUserWithAchievements.bind(this, user))
            );
        }, this);
        return Promise.all(promises);
    },

    _linkUserWithAchievements: function (userData, userModel) {
        return userModel.setAchievements(userData.achievements);
    },

    _createHits: function (hits) {
        var promises = [];
        hits.forEach(function (hit) {
            promises.push(Hits.create(hit));
        });
        return Promise.all(promises);
    }
};
