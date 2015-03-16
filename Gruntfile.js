module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-commit-message-verify');

    grunt.loadTasks('./extensions/build/');

    grunt.registerTask('setup', 'Установка окружения', ['githooks']);

    grunt.config('githooks', {
        all: {
            'pre-commit': 'pre-commit-check',
            'pre-push': 'pre-push-check'
        }
    });

    grunt.config('jscs', {
        src: [
            'Gruntfile.js',
            'server/auth/**.js',
            'server/db/**.js',
            'server/controllers/**.js',
            'server/*.js',
            'extensions/common/modules/**/**.js'
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

    grunt.registerTask('pre-commit-check', ['jscs']);
    grunt.registerTask('pre-push-check', ['grunt-commit-message-verify']);
};
