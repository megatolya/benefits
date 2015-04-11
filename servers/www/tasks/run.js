'use strict';

var sass = require('node-sass');

module.exports = function (grunt) {
    grunt.registerTask('public', 'Верстка', function () {
        grunt.file.mkdir('public');

        var output = {};
        var extensions = ['js', 'css'];

        function concat(extension, filename) {
            output[extension] += grunt.file.read(filename);
        }

        extensions.forEach(function (extension) {
            output[extension] = '';

            grunt.file.expand([
                'servers/www/public/libs/**/*.' + extension
            ]).forEach(concat.bind(null, extension));

            grunt.file.expand([
                'servers/www/public/**.' + extension,
                'servers/www/public/**/*.' + extension,
                '!servers/www/public/libs/**/*.' + extension
            ]).forEach(concat.bind(null, extension));
        });

        output.css = sass.renderSync({
            data: output.css
        }).css;

        extensions.forEach(function (extension) {
            grunt.file.write('public/index.' + extension, output[extension]);
        });
    });
};
