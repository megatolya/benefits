'use strict';

var bucketKing = require('common/bucketKing');
var Signal = require('common/signal');
var storage = require('common/storage');

var NAVIGATION_KEY = 'navigation';

bucketKing.register(NAVIGATION_KEY, onRulesUpdated);

function onRulesUpdated(rules) {
    storage.set(NAVIGATION_KEY, rules);
    navigationBucket.updated.dispatch(rules);
}

var navigationBucket = {
    updated: new Signal()
};

module.exports = navigationBucket;
