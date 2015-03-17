'use strict';

module.exports = function (grunt) {
    var rm = grunt.file.delete;

    grunt.registerTask('clean', function () {
        rm(grunt.config('specific_path') + '/');
        rm(grunt.config('dist_path') + '/');
    });
};
