'use strict';

module.exports = function (grunt) {
    var db = require('../../server/db');
    var data = require('../db.js');
    var Q = require('q');

    grunt.registerTask('init-database', function () {
        var done = this.async();


        var achievements = Q.all(data.achievements.map(function (achievement) {
            return db.achievements.add(achievement);
        }));

        var users = Q.all(data.users.map(function (user) {
            return db.users.add(user.uid, user.salt);
        }));

        var userAchievements = Q.all(Object.keys(data.userAchievements).map(function (uid) {
            var achievements = data.userAchievements[uid];

            return db.userAchievements.add(uid, achievements);
        }));

        var userHits = Q.all(Object.keys(data.userHits).map(function (uid) {
            var hits = data.userHits[uid];

            return db.userHits.update(uid, hits);
        }));

        Q.all([achievements, users, userAchievements, userHits]).then(function () {
            done();
        }).fail(function (reason) {
            grunt.fail.fatal(reason);
        });
    });
};
