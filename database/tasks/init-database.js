'use strict';

module.exports = function (grunt) {
    var db = require('../../server/db');
    var data = require('../db.js');
    var Q = require('q');

    grunt.registerTask('init-database', function () {
        var done = this.async();


        var achievements = Q.all(data.achievements.map(function (achievement) {
            return db.addAchievement(achievement);
        }));

        var users = Q.all(data.users.map(function (user) {
            return db.addUser(user.uid, user.salt);
        }));

        var userAchivements = Q.all(Object.keys(data.userAchivements).map(function (uid) {
            var achievements = data.userAchivements[uid];

            return db.addUserAchivements(uid, achievements);
        }));

        var userHits = Q.all(Object.keys(data.userHits).map(function (uid) {
            var hits = data.userHits[uid];

            return db.updateUserHits(uid, hits);
        }));

        Q.all([achievements, users, userAchivements, userHits]).then(function () {
            done();
        }).fail(function (reason) {
            grunt.fail.fatal(reason);
        });
    });
};
