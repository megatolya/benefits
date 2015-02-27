module.exports = function (grunt) {
    var copy = grunt.file.copy;
    var rm = grunt.file.delete;
    var read = grunt.file.read;
    var write = grunt.file.write;
    var exists = grunt.file.exists;

    var path = require('path');

    //grunt.loadNpmTasks('grunt-shell');

    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('fx-temp-dir', 'Скопировать все во временную директорию', function() {
        grunt.file.expand({filter: 'isFile'}, 'firefox/**').forEach(function (file) {
            copy(file, '.grunt/' + file);
        });
    });

    grunt.registerTask('fx-common-modules', 'Собрать общие модули', function() {
        grunt.file.expand({filter: 'isFile'}, 'common/modules/**').forEach(function (file) {
            copy(file, '.grunt/firefox/chrome/content/modules/' + path.basename(file));
        });
    });

    grunt.registerTask('firefox', ['fx-temp-dir', 'fx-common-modules', 'browserify:firefox', 'fx-beautify-app']);

    grunt.config('browserify', {
        firefox: {
            src: ['.grunt/firefox/chrome/content/modules/*.js'],
            dest: '.grunt/firefox/chrome/content/application.jsm'
        }
    });

    grunt.registerTask('fx-beautify-app', function() {
        var BEFORE = '\'use strict\'\nconst EXPORTED_SYMBOLS = [];\n';
        write('.grunt/firefox/chrome/content/application.jsm', BEFORE + read('.grunt/firefox/chrome/content/application.jsm'));
    });
};
