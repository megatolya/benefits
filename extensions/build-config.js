'use strict';

module.exports = function (grunt) {
    var cwd = 'extensions/';
    grunt.initConfig({
        extensions_path: 'extensions',

        images_path: cwd + 'images',

        firefox: {
            src: cwd + 'firefox',
            modules: cwd + 'firefox/chrome/content/modules',
            dist: cwd + 'out/firefox',
            dist_app: cwd + 'out/firefox/chrome/content/application.jsm'
        },
        chrome: {
            src: cwd + 'chrome',
            modules: cwd + 'chrome/modules',
            dist: cwd + 'out/chrome',
            dist_app: cwd + 'out/chrome/application.js'
        },

        common_path: cwd + 'common',
        common_app: cwd + 'common/app.js',
        specific_path: cwd + 'specific',
        dist_root_path: cwd + 'out',

        // при сборке подменяются на значения firefox или chrome
        browser_src_path: cwd + 'chrome',
        browser_modules_path: cwd + 'chrome/modules',
        dist_path: cwd + 'out/chrome',
        dist_app: cwd + 'out/chrome/application.js'
    });
};
