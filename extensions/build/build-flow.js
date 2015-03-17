'use strict';

module.exports = function (grunt) {
    grunt.registerTask('build-all', [
        'build:firefox',
        'build:chrome'
    ]);

    grunt.registerTask('build', function (browser) {
        var tasks = [
            'set-browser-config:' + browser,
            'clean',
            'copy-extension',
            'compile'
        ];

        if (browser === 'firefox') {
            tasks.push('add-exported-symbols');
        }

        grunt.task.run(tasks);
    });
};
