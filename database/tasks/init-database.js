'use strict';

module.exports = function (grunt) {
    var db = require('../../server/db');
    var achievements = require('../achievements.json');
    var Q = require('q');

    grunt.registerTask('init-database', function () {
        var done = this.async();

        Q.all(achievements.map(function (achievement) {
            return db.addAchievement(achievement);
        })).then(function() {
            done();
        }).fail(function (reason) {
            grunt.fail.fatal(reason);
        });
    });
};
