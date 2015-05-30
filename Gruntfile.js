module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-commit-message-verify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadTasks('./extensions/');
    grunt.loadTasks('./extensions/build/');

    grunt.loadTasks('./database/tasks/');

    grunt.loadTasks('./servers/tasks/');
    grunt.loadTasks('./servers/www/tasks/');

    grunt.registerTask('setup', 'Установка окружения', ['githooks']);

    grunt.config('githooks', {
        all: {
            'pre-commit': 'pre-commit-check'
        }
    });

    grunt.config('jshint', {
        options: {
            jshintrc: true
        },
        server: ['servers/**/*.js', '!servers/www/public/libs/**'],
        db: ['database/**/*.js'],
        extensions: ['<%= extensions_path %>/**/*.js', '!<%= dist_root_path %>/**', '!<%= specific_path %>/**']
    });

    grunt.config('jscs', {
        src: [
            'Gruntfile.js',
            'servers/auth/**.js',
            'servers/**/db/**.js',
            'servers/**/controllers/**.js',
            'servers/**/*.js',
            'extensions/common/**.js',
            'extensions/build/**.js',
            '!servers/www/public/libs/**'
        ],
        options: {
            config: '.jscsrc'
        }
    });

    grunt.registerTask('run', ['public', 'run-servers']);

    grunt.registerTask('pre-commit-check', ['jscs', 'jshint']);
};
