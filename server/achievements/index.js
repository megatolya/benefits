'use strict';

var Q = require('q');
var db = require('../db');

function createRule(achievement) {
    var rule = {};

    if (achievement.time) {
        rule.time = achievement.time;
    }

    rule.url_pattern = achievement.url;
    // TODO не в черный релиз
    // rule.hits = this._hits;
    rule.rule_id = achievement.id;

    return rule;
}

var achievementManager = {
    // FIXME
    getRulesForUser: function(uid) {
        var deferred = Q.defer();

        db.achievements.getAll().then(function (achievements) {
            deferred.resolve(achievements.map(function (achievement) {
                return createRule(achievement);
            }));
        }).fail(deferred.reject);

        return deferred.promise;
    },

    trackDump: function(uid, trackData) {
        db.userHits.update(uid, trackData).then(function () {
            return Q.all([
                db.userHits.get(uid),
                db.userAchievements.get(uid),
                db.achievements.getAll()
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
    brezhnevGlance: function (userHits, userAchievements, allAchievements, uid) {
        userAchievements = userAchievements.map(function (achievement) {
            return achievement.id;
        });
        console.log('brezhnevGlance started for user', uid);

        userHits = userHits.reduce(function (hits, row) {
            hits[row.rule_id] = row.hits;
            return hits;
        }, Object(null));

        console.log('---------');
        console.log('userAchievements', userAchievements);
        console.log('');
        console.log('userHits', userHits);
        console.log('');
        console.log('allAchievements', allAchievements);
        console.log('---------');

        var newAchievements = allAchievements.reduce(function (newAchievements, achievement) {
            if (userAchievements.indexOf(achievement.id) !== -1) {
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
        db.userAchievements.add(uid, newAchievements);
    }
};

module.exports = achievementManager;
