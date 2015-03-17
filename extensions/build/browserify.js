'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');

    grunt.config('browserify', {
        options: {
            debug: true,
            browserifyOptions: {
                paths: ['./node_modules', './' + grunt.config('extensions_path') + '/']
            }
        },
        dev: {
            src: '<%= common_app %>',
            dest: '<%= dist_app %>'
        }
    });

    grunt.registerTask('compile', function () {
        grunt.task.run(['browserify']);
    });
};
