'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-bg-shell');
    grunt.loadNpmTasks('grunt-shell');

    grunt.config('bgShell', {
        mongodb: {
            cmd: 'mongod --dbpath ./db',
            stdout: false,
            stderr: true,
            bg: true,
            fail: true,
            done: console.log.bind(console)
        }
    });

    grunt.config('shell', {
        'kill-database': {
            command: 'killall mongod',
        },
        options: {
            failOnError: false
        }
    });

    grunt.registerTask('stop-database', ['shell:kill-database']);

    grunt.registerTask('run-database', function() {
        if (grunt.option('fresh')) {
            grunt.task.run('stop-database');
            grunt.task.run('clean-database');
        }

        grunt.task.run('bgShell:mongodb');

        if (grunt.option('fresh')) {
            grunt.task.run('init-database');
        }
    });

    var dbConfig = {};
    [
        'start',
        'restart',
        'run',
        'stop',
        'finish',
        'init',
        'kill'
    ].forEach(function (alias) {
        dbConfig[alias] = {};
    });

    grunt.config('db', dbConfig);

    grunt.registerMultiTask('db', function() {
        var task = '';
        switch (this.target) {
            case 'start':
            case 'run':
            case 'init':
            case 'restart':
                task = 'run-database';
                break;

            case 'stop':
            case 'kill':
            case 'finish':
                task = 'stop-database';
                break;
        }

        if (task) {
            grunt.task.run(task);
        }
    });
};
