'use strict';

var db = require('./db');
var _ = require('lodash');

var models = require('./models');

var User = models.User;
var Achievement = models.Achievement;
var Rule = models.Rule;
var Hits = models.Hits;

module.exports = {
    insertInitialData: function (data) {
        this._createAchievements(data.achievements);
        this._createRules(data.rules);
        this._createUsers(data.users);
        this._createHits(data.hits);
    },

    _createAchievements: function (achievements) {
        achievements.forEach(function (ach) {
            var achDataToSave = _.extend({}, ach);
            delete achDataToSave.rules;
            Achievement.create(achDataToSave)
                .then(this._linkAchievementsWithRules.bind(this, ach))
                .then(this._addAchievementChildren.bind(this, ach));
        }, this);
    },

    _linkAchievementsWithRules: function (achievementData, achievementModel) {
        achievementModel.setRules(achievementData.rules);
        return achievementModel;
    },

    _addAchievementChildren: function (achievementData, achievementModel) {
        achievementModel.setChildren(achievementData.children);
        return achievementModel;
    },

    _createRules: function (rules) {
        rules.forEach(function (rule) {
            Rule.create(rule);
        });
    },

    _createUsers: function (users) {
        users.forEach(function (user) {
            var userToSave = _.extend({}, user);
            delete userToSave.achievements;
            User.create(user)
                .then(this._linkUserWithAchievements.bind(this, user));
        }, this);
    },

    _linkUserWithAchievements: function (userData, userModel) {
        userModel.setAchievements(userData.achievements);
    },

    _createHits: function (hits) {
        hits.forEach(function (hit) {
            Hits.create(hit);
        });
    }
};
