'use strict';

var bucketKing = require('common/bucketKing');
var trackMan = require('common/trackMan');

var Signal = require('common/signal');
var storage = require('common/storage');

var NAVIGATION_KEY = 'navigation';
var dump = {};

function onRulesUpdated(rules) {
    console.log('Navigation bucket rules: ', rules);
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

bucketKing.register(NAVIGATION_KEY, onRulesUpdated);
trackMan.register(NAVIGATION_KEY, navigationBucket.getDump.bind(navigationBucket));

module.exports = navigationBucket;
