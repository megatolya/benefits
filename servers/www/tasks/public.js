'use strict';

var sass = require('node-sass');
var path = require('path');

module.exports = function (grunt) {
    grunt.registerTask('public', 'Верстка', function () {
        grunt.file.mkdir('public');

        var output = {};
        var extensions = ['js', 'css'];

        function concat(extension, filename) {
            console.log('reading', filename);
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

        output.js = 'window._i18n = ' + JSON.stringify(require('../i18n')) + ';\n' + output.js;

        try {
            output.css = sass.renderSync({
                data: output.css
            }).css;
        } catch (err) {
            grunt.fail.fatal(err);
            return;
        }

        extensions.forEach(function (extension) {
            grunt.file.write('public/index.' + extension, output[extension]);
        });

        grunt.file.expand([
            'servers/www/public/libs/fontawesome/fonts/*'
        ]).forEach(function (font) {
            grunt.file.copy(font, 'public/fonts/' + path.basename(font));
        });
    });
};
