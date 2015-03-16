module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-commit-message-verify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadTasks('./extensions/');
    grunt.loadTasks('./extensions/build/');

    grunt.registerTask('setup', 'Установка окружения', ['githooks']);

    grunt.config('githooks', {
        all: {
            'pre-commit': 'pre-commit-check',
            'pre-push': 'pre-push-check'
        }
    });

    grunt.config('jshint', {
        options: {
            jshintrc: true
        },
        // server: ['server/**/*.js'],
        extensions: ['<%= extensions_path %>/**/*.js', '!<%= dist_root_path %>/**', '!<%= impl_path %>/**']
    });

    grunt.config('jscs', {
        src: [
            'Gruntfile.js',
            'server/auth/**.js',
            'server/db/**.js',
            'server/controllers/**.js',
            'server/*.js',
            'extensions/modules/**.js',
            'extensions/build/**.js'
        ],
        options: {
            config: '.jscsrc'
        }
    });

    grunt.config('grunt-commit-message-verify', {
        minFirstLineLength: 10,
        maxFirstLineLength: 60,
        maxLineLength: 80,
        regexes: {
            'check start of the commit': {
                regex: /^(Issue #([0-9])+\s.+|cc.*|typo?.*)/,
                explanation: 'Issue #xxx что сделано. Или "cc что сделано". Или "typo что сделано"'
            }
        }
    });

    grunt.registerTask('pre-commit-check', ['jscs', 'jshint']);
    grunt.registerTask('pre-push-check', ['grunt-commit-message-verify']);
};
