'use strict';

module.exports = function (grunt) {
    var read = grunt.file.read;
    var write = grunt.file.write;

    grunt.registerTask('add-exported-symbols', function () {
        var BEFORE = '\'use strict\';\nconst EXPORTED_SYMBOLS = [];\n';
        var appPath = grunt.config('dist_app');
        write(appPath, BEFORE + read(appPath));
    });
};
