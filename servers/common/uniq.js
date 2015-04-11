'use strict';

var md5 = require('MD5');

module.exports = function () {
    return md5(new Date() + Math.random()).slice(0, 10);
};
