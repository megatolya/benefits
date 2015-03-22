'use strict';

//"urlPattern": "http(s)://vk.com/**|http(s)://vkontakte.ru",
module.exports = function (grunt) {
    grunt.registerTask('clean-database', function () {
        grunt.file.delete('db');
        grunt.file.mkdir('db');
    });
};
