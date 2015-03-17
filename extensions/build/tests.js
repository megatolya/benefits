'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.config('mochaTest', {
        extensions_common: {
            options: {
                reporter: 'spec',
                clearRequireCache: true
            },
            src: ['<%= common_path %>/**/*-test.js']
        }
    });

    grunt.registerTask('test-extensions', ['mochaTest:extensions_common']);
};
