'use strict';

var navigationBucket = require('common/buckets/navigation-bucket');
var console = require('specific/console');
var navigationManager = require('specific/navigation');

navigationManager.locationChanged.add(onLocationsChanged);
navigationBucket.updated.add(onRulesUpdated);

function onRulesUpdated() {
    console.log('rules updated');
}

function onLocationsChanged(locationData) {
    console.log('locationData.url: ', locationData.url);
    navigationBucket.rules.forEach(function (rule) {
        var regExp = new RegExp(rule.url_pattern);
        if (regExp.test(locationData.url)) {
            console.log('save to dump');
            navigationBucket.saveToDump(rule.rule_id);
        }
    });
}
