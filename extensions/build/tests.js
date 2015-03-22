'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.config('mochaTest', {
        extension_common: {
            options: {
                reporter: 'spec',
                clearRequireCache: false
            },
            src: ['<%= common_path %>/**/*-test.js']
        }
    });

    grunt.registerTask('test-extension', [
        'symlink:extension_common',
        'symlink:extension_specific',
        'mochaTest:extension_common'
    ]);
};
