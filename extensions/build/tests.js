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

    grunt.registerTask('test-extensions', [
        'symlink:extensions_common',
        'symlink:extensions_specific',
        'mochaTest:extensions_common'
    ]);
};
