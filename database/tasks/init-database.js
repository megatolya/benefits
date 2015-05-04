'use strict';

module.exports = function (grunt) {
    var dbInitializer = require('../../servers/api/db/db-initializer');
    var data = require('../data');
    var Q = require('q');
    var _ = require('lodash');
    var images = require('../../servers/www/images');
    var path = require('path');
    var md5 = require('MD5');

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

    function cropImageForAchievement(achievement) {
        return images.crop(getSourcePath(achievement.image), getDistPath(achievement.image).abs).then(function () {
            achievement.image = getDistPath(achievement.image).web;
        });
    }

    grunt.registerTask('init-database', function () {
        var done = this.async();

        Q.all(data.achievements.map(cropImageForAchievement))
            .then(function () {
                return dbInitializer.initSchema(true);
            }).then(function () {
                return dbInitializer.insertInitialData(data);
            }).then(done).fail(grunt.fail.fatal);
    });
};
