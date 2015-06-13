'use strict';

var debug = require('debug')('app:facebook-crawler');
var config = require('../../../config');

module.exports = {
    crawl: function (user) {
        debug('Start crawling for user: ', user.id);
    }
};
