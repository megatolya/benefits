'use strict';

module.exports = function (grunt) {
    var initiallizer = require('../../servers/api/db/dev-data');
    var db = require('../../servers/api/db');
    var data = require('../data');
    var Q = require('q');
    var _ = require('lodash');
    var images = require('../../servers/www/images');
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

        Q.all(data.achievements.map(function (achievement) {
            return images.crop(getSourcePath(achievement.image), getDistPath(achievement.image).abs).then(function () {
                achievement.image = getDistPath(achievement.image).web;
            });
        })).then(function () {
            db.init({force: true});
            initiallizer.insertInitialData(data);
        }).fail(grunt.fail.fatal);
    });
};
