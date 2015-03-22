'use strict';

var bucketKing = require('common/bucketKing');
var trackMan = require('common/trackMan');

var Signal = require('common/signal');
var storage = require('common/storage');

var NAVIGATION_KEY = 'navigation';
var dump = {};

trackMan.register(navigationBucket.getDump.bind(navigationBucket));
bucketKing.register(NAVIGATION_KEY, onRulesUpdated);

function onRulesUpdated(rules) {
    navigationBucket.rules = rules || [];
    storage.set(NAVIGATION_KEY, rules);
    navigationBucket.updated.dispatch(rules);
}

var navigationBucket = {
    rules: [],

    saveToDump: function (ruleId) {
        if (!dump[ruleId]) {
            dump[ruleId] = 1;
        } else {
            dump[ruleId] += 1;
        }
    },

    getDump: function () {
        var copyDump = dump;
        dump = {};
        return copyDump;
    },

    updated: new Signal()
};

module.exports = navigationBucket;
