'use strict';

var debug = require('debug')('CrawlerManager');
var config = require('../../config');
var twitterCrawler = require('./twitter');

module.exports = {
    crawl: function (user, provider) {
        switch (provider) {
            case config.providers.twitter.name:
                this._twitterCrawl(user);
                break;
            default:
                debug('Unsupported provider: ', provider);
        }
    },

    _twitterCrawl: function (user) {
        // TODO add this call to twitter-crawl-queue
        twitterCrawler.crawl(user);
    }
};
