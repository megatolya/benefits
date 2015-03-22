'use strict';

var db = require('../../server/db');
var achievements = require('../achievements.json');
var Q = require('q');

//"urlPattern": "http(s)://vk.com/**|http(s)://vkontakte.ru",
module.exports = function (grunt) {
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
