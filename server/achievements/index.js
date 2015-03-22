'use strict';

var Q = require('q');
var db = require('../db');

function Achievement (dbRow) {
    this._id = dbRow._id;
    this._name = dbRow.name;
    this._url = dbRow.url;
    this._hits = dbRow.hits;
    this._time = dbRow.time;
}

Achievement.prototype = {
    constructor: Achievement,

    getRule: function() {
        var rule = {};

        if (this._time) {
            rule.time = this._time;
        }

        rule.url = this._url;
        rule.trigger_limit = this._hits;
        rule.rule_id = this.name;

        return rule;
    },

    get name() {
        return this._name;
    }
};

var achievementManager = {
    getRulesForUser: function(uid) {
        var deferred = Q.defer();

        db.getAllAchievements().then(function (achievements) {
            deferred.resolve(achievements.map(function (achievement) {
                return new Achievement(achievement).getRule();
            }));
        }).fail(deferred.reject);

        return deferred.promise;
    }
};

module.exports = achievementManager;
