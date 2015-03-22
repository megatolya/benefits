'use strict';

var navigationBucket = require('common/navigationBucket');
var navigationManager = require('specific/navigation');

navigationManager.locationChanged.add(onLocationsChanged);
navigationBucket.updated.add(onRulesUpdated);

function onRulesUpdated(rules) {
}

function onLocationsChanged(locationData) {
}

var navigationTracker = {
};

module.exports = navigationTracker;
