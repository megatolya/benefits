'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.config('copy.specific', {
        expand: true,
        cwd: '<%= browser_modules_path %>/',
        src: '**',
        dest: '<%= specific_path %>/'
    });

    grunt.config('copy.out', {
        expand: true,
        cwd: '<%= browser_src_path %>/',
        filter: function (path) {
            return !/.*\/modules\/.*/.test(path);
        },
        src: ['**'],
        dest: '<%= dist_path %>/'
    });

    grunt.registerTask('copy-extension', function () {
        grunt.task.run(['copy:specific', 'copy:out']);
    });
};
