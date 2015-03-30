'use strict';

module.exports = function (grunt) {
    grunt.registerTask('run-servers', 'Запустить серверы сайта и API', function () {
        this.async();
        require('../api');
        require('../www');
    });
};
