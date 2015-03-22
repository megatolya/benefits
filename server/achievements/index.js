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

        rule.url_pattern = this._url;
        // TODO не в черный релиз
        // rule.hits = this._hits;
        rule.rule_id = this.name;

        return rule;
    },

    get name() {
        return this._name;
    }
};

var achievementManager = {
    // FIXME
    getRulesForUser: function(uid) {
        var deferred = Q.defer();

        db.getAllAchievements().then(function (achievements) {
            deferred.resolve(achievements.map(function (achievement) {
                return new Achievement(achievement).getRule();
            }));
        }).fail(deferred.reject);

        return deferred.promise;
    },

    trackDump: function(uid, trackData) {
        db.updateUserHits(uid, trackData).then(function () {
            return Q.all([
                db.getUserHits(uid),
                db.getUserAchivements(uid),
                db.getAllAchievements()
            ]);
        }).then(function (res) {
            return this.brezhnevGlance.apply(this, res.concat(uid));
        }.bind(this)).fail(function (reason) {
            console.error('Failed to track dump', reason);

            if ((reason || {}).stack) {
                console.error('stack', reason.stack);
            }
        });
    },

    // Поиск новых ачивок, учитывая полученные
    brezhnevGlance: function (userHits, userAchivements, allAchievements, uid) {
        userAchivements = userAchivements.map(function (achievement) {
            return achievement.id;
        });
        console.log('brezhnevGlance started for user', uid);

        userHits = userHits.reduce(function (hits, row) {
            hits[row.rule_id] = row.hits;
            return hits;
        }, Object(null));

        console.log('---------');
        console.log('userAchivements', userAchivements);
        console.log('');
        console.log('userHits', userHits);
        console.log('');
        console.log('allAchievements', allAchievements);
        console.log('---------');

        var newAchievements = allAchievements.reduce(function (newAchievements, achievement) {
            if (userAchivements.indexOf(achievement.id) !== -1) {
                return newAchievements;
            }

            if (userHits[achievement.id] >= achievement.hits) {
                newAchievements.push(achievement.id);
            }

            return newAchievements;
        }, []);

        if (newAchievements.length === 0) {
            console.log('Brezhnev dissapointed :(');
            return;
        }

        console.log('New achievements', newAchievements);
        db.addUserAchivements(uid, newAchievements);
    }
};

module.exports = achievementManager;
