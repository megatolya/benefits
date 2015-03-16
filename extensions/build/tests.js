'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.config('mochaTest', {
        common: {
            options: {
                reporter: 'spec',
                clearRequireCache: true
            },
            src: ['<%= modules_path %>/**/*-test.js']
        }
    });

    grunt.registerTask('test-common', ['mochaTest:common']);
};
