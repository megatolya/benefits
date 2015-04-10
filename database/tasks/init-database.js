'use strict';

module.exports = function (grunt) {
    var db = require('../../servers/api/db');
    var data = require('../db.js');
    var Q = require('q');
    var _ = require('lodash');
    var easyimg = require('easyimage');
    var path = require('path');
    var md5 = require('MD5');

    grunt.registerTask('init-database', function () {
        var done = this.async();

        function getDistPath(imageName) {
            var extName = path.extname(imageName);
            var webPath = path.join('achievements', md5(imageName) + extName);
            grunt.file.mkdir(path.join('public', 'achievements'));

            return {
                web: '/' + webPath,
                abs: path.resolve(__dirname, path.join('..', '..', 'public', webPath))
            };
        }

        function getSourcePath(imageName) {
            return path.resolve(path.join('database', 'images', imageName));
        }

        var achievements = Q.all(data.achievements.map(function (achievement) {
            achievement = _.assign({}, achievement);
            achievement.image = getDistPath(achievement.image).web;

            return db.achievements.add(achievement);
        }));

        var achievementImages = Q.all(data.achievements.map(function (achievement) {
            var IMAGE_SIZE = 100;

            return easyimg.rescrop({
                src: getSourcePath(achievement.image),
                dst: getDistPath(achievement.image).abs,
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                cropwidth: IMAGE_SIZE,
                cropheight: IMAGE_SIZE,
                x:0,
                y:0,
                fill: true
            });
        }));

        var users = Q.all(data.users.map(function (user) {
            return db.users.add(user);
        }));

        var userAchievements = Q.all(Object.keys(data.userAchievements).map(function (uid) {
            var achievements = data.userAchievements[uid];

            return db.userAchievements.add(uid, achievements);
        }));

        var userHits = Q.all(Object.keys(data.userHits).map(function (uid) {
            var hits = data.userHits[uid];

            return db.userHits.update(uid, hits);
        }));

        Q.all([achievements, users, achievementImages, userAchievements, userHits]).then(function () {
            done();
        }).fail(function (reason) {
            grunt.fail.fatal(reason);
        });
    });
};
