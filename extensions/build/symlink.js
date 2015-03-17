'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-symlink');

    grunt.config('symlink.extensions_common', {
        src: '<%= common_path %>',
        dest: './node_modules/common'
    });

    grunt.config('symlink.extensions_specific', {
        src: '<%= specific_path %>',
        dest: './node_modules/specific'
    });
};
