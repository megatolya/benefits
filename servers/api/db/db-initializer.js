'use strict';

var db = require('./index');
var _ = require('lodash');
var debug = require('debug')('app:dev-data');

var models = require('./models');

var User = models.User;
var Achievement = models.Achievement;
var Rule = models.Rule;
var Hits = models.Hits;
var Tag = models.Tag;

module.exports = {
    initSchema: function (force) {
        debug('initializing db schema, force option:', force);
        return db.sync({force: force});
    },

    insertInitialData: function (data) {
        debug('inserting initial data %o', data);
        return this._createSeries([
            this._createTags.bind(this, data.tags),
            this._createUsers.bind(this, data.users),
            this._createRules.bind(this, data.rules),
            this._createHits.bind(this, data.hits),
            this._createAchievements.bind(this, data.achievements)
        ]).then(this._applyRelationsQueue.bind(this));
    },

    _createAchievements: function (achievements) {
        return this._createSeries(achievements.map(function (ach) {
            return function () {
                debug('_createAchievements');
                var achDataToSave = _.extend({}, ach);
                delete achDataToSave.rules;
                return Achievement.create(achDataToSave).then(function (achModel) {
                    this._relationsQueue.push(this._addAchievementsRelations.bind(this, ach, achModel));
                }.bind(this));
            }.bind(this);
        }, this));
    },

    _addAchievementsRelations: function (achievementData, achievementModel) {
        return Promise.all([
            this._linkAchievementsWithRules(achievementData, achievementModel),
            this._addAchievementTags(achievementData, achievementModel),
            this._addAchievementChildren(achievementData, achievementModel)
        ]);
    },

    _linkAchievementsWithRules: function (achievementData, achievementModel) {
        debug('_linkAchievementsWithRules');
        return achievementModel.setRules(achievementData.rules);
    },

    _addAchievementTags: function (achievementData, achievementModel) {
        debug('_addAchievementTags');
        return achievementModel.setTags(achievementData.tags);
    },

    _addAchievementChildren: function (achievementData, achievementModel) {
        debug('_addAchievementChildren');
        return achievementModel.setChildren(achievementData.children);
    },

    _createRules: function (rules) {
        return this._createSeries(rules.map(function (rule) {
            return function () {
                debug('_createRules');
                return Rule.create(rule);
            };
        }));
    },

    _createUsers: function (users) {
        return this._createSeries(users.map(function (user) {
            return function () {
                debug('_createUsers');
                var userToSave = _.extend({}, user);
                delete userToSave.achievements;
                return User.create(user).then(function (userModel) {
                    this._relationsQueue.push(this._linkUserWithAchievements.bind(this, user, userModel));
                }.bind(this));
            }.bind(this);
        }, this));
    },

    _linkUserWithAchievements: function (userData, userModel) {
        debug('_linkUserWithAchievements');
        return userModel.setAchievements(userData.achievements);
    },

    _createHits: function (hits) {
        return this._createSeries(hits.map(function (hit) {
            return function () {
                debug('_createHits');
                return Hits.create(hit);
            };
        }));
    },

    _createTags: function (tags) {
        return this._createSeries(tags.map(function (tag) {
            return function () {
                debug('_createTags');
                return Tag.create(tag);
            };
        }));
    },

    _relationsQueue: [],
    _applyRelationsQueue: function () {
        return this._createSeries(this._relationsQueue);
    },

    _createSeries: function (array) {
        var promise = Promise.resolve();
        array.forEach(function (fn) {
            promise = promise.then(fn);
        });
        return promise;
    }
};
