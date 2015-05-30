'use strict';

var Q = require('q');
var db = require('../db');

var achievementManager = {
    getRulesForUser: function (uid) {
        return this.getLockedForUser(uid).then(function (achievements) {
            return achievements.reduce(function (rules, achievement) {
                achievement.rules.forEach(function (raw, index) {
                    var rule = {};

                    if (raw.time) {
                        rule.time = raw.time;
                    }

                    rule.url_pattern = raw.url;
                    rule.rule_id = raw.id;
                    rule.hits = raw.hits;

                    rules.push(rule);
                });

                return rules;
            }, []);
        });
    },

    trackDump: function (uid, trackData) {
        return db.userHits.update(uid, trackData).then(function () {
            return Q.all([
                db.userHits.get(uid),
                db.userAchievements.get(uid),
                db.achievements.getAll()
            ]);
        }).then(function (res) {
            return this.brezhnevGlance.apply(this, res.concat(uid));
        }.bind(this));
    },

    // Поиск новых ачивок, учитывая полученные
    brezhnevGlance: function (userHits, userAchievements, allAchievements, uid) {
        userAchievements = userAchievements.map(function (achievement) {
            return achievement.id;
        });

        userHits = userHits.reduce(function (hits, row) {
            hits[row.rule_id] = row.hits;
            return hits;
        }, Object(null));

        var newAchievements = allAchievements.reduce(function (newAchievements, achievement) {
            if (userAchievements.indexOf(achievement.id) !== -1) {
                return newAchievements;
            }

            var satisfied = achievement.rules.every(function (rule) {
                if (rule.id in userHits && userHits[rule.id] >= rule.hits) {
                    return true;
                }

                return false;
            });

            if (satisfied) {
                newAchievements.push(achievement.id);
            }

            return newAchievements;
        }, []);

        if (newAchievements.length === 0) {
            return;
        }

        db.userAchievements.add(uid, newAchievements);
    },

    getLockedForUser: function (uid) {
        return Q.all([
            db.achievements.getAll(),
            db.userAchievements.getOnlyIds(uid)
        ]).then(function (res) {
            var userAchievements = res[1];

            return res[0].filter(function (achievement) {
                if (userAchievements.indexOf(achievement.id) !== -1) {
                    return false;
                }

                if (achievement.availableAfter || achievement.parent) {
                    if (achievement.parent) {
                        achievement.availableAfter =
                            (achievement.availableAfter || [])
                            .concat(achievement.parent);
                    }

                    return achievement.availableAfter.every(function (achievement) {
                        return userAchievements.indexOf(achievement) !== -1;
                    });
                }

                return true;
            });
        });
    },
};

module.exports = achievementManager;
