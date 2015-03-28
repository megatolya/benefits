'use strict';

var sessionManager = require('common/session-manager');
var console = require('specific/console');
var timer = require('specific/timer');
var bucketKing = require('common/buckets/bucket-king');
var achievements = require('common/achievements');

require('common/trackers/navigation-tracker');

var REPEAT_AFTER_ERROR_TIMEOUT = 1000 * 60;

var app = {
    start: function () {
        sessionManager.startSession()
            .then(bucketKing.start.bind(bucketKing))
            .then(achievements.start.bind(achievements))
            .catch(catchErrors);
    }
};

function catchErrors(data) {
    console.log('Fatal error: %o', data);
    timer.shot(app.start, REPEAT_AFTER_ERROR_TIMEOUT, app);
}

achievements.updated.add(function (achievements) {
    console.log('Achievements updated: ', achievements);
});

achievements.unlocked.add(function (achievements) {
    console.log('----------------------------------');
    console.log('Achievements unlocked: ', achievements);
    console.log('----------------------------------');
});

app.start();
