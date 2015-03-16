'use strict';


module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.config('copy', {
        impl: {
            expand: true,
            cwd: '<%= browser_modules_path %>/',
            src: '**',
            dest: '<%= impl_path %>/'
        }
    });

    grunt.registerTask('copy-impl', function () {
        grunt.task.run(['copy']);
    });
};
