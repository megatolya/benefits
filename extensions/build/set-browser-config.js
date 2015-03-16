'use strict';

module.exports = function (grunt) {
    grunt.registerTask('set-browser-config', function (browser) {
        grunt.config.set('browser_src_path', grunt.config(browser + '.src'));
        grunt.config.set('browser_modules_path', grunt.config(browser + '.modules'));
        grunt.config.set('dist_path', grunt.config(browser + '.dist'));
        grunt.config.set('dist_app', grunt.config(browser + '.dist_app'));
    });
};
