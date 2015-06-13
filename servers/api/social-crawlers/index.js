'use strict';

var debug = require('debug')('app:crawler-manager');
var config = require('../../config');

var crawlers = {};
crawlers[config.providers.twitter.name] = require('./twitter');
crawlers[config.providers.facebook.name] = require('./facebook');
crawlers[config.providers.github.name] = require('./github');

module.exports = {
    crawl: function (user, provider) {
        var crawler = crawlers[provider];
        if (crawler && typeof crawler.crawl === 'function') {
            crawler.crawl(user);
        } else {
            debug('Unsupported provider: ', provider);
        }
    }
};
