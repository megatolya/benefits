'use strict';

var navigationBucket = require('common/navigationBucket');
var navigationManager = require('specific/navigation');

navigationManager.locationChanged.add(onLocationsChanged);
navigationBucket.updated.add(onRulesUpdated);

function onRulesUpdated() {
    console.log('rules updated');
}

function onLocationsChanged(locationData) {
    console.log('locationData.url: ', locationData.url);
    navigationBucket.rules.forEach(function (rule) {
        if (locationData.url.indexOf(rule.url_pattern) !== -1) {
            navigationBucket.saveToDump(rule.rule_id);
        }
    });
}
