'use strict';

module.exports = function (grunt) {
    var cwd = 'extensions/';
    grunt.initConfig({
        extensions_path: 'extensions',

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

        modules_path: cwd + 'modules',
        modules_app: cwd + 'modules/app.js',
        impl_path: cwd + 'impl',
        dist_root_path: cwd + 'out',

        // при сборке подменяются на значения firefox или chrome
        browser_src_path: cwd + 'firefox',
        browser_modules_path: cwd + 'firefox/chrome/content/modules',
        dist_path: cwd + 'out/firefox',
        dist_app: cwd + 'out/firefox/chrome/content/application.jsm'
    });
};
