'use strict';

var serverConnector = require('common/server-connector');
var sessionManager = require('common/session-manager');
var console = require('specific/console');
var timer = require('specific/timer');
var bucketKing = require('common/buckets/bucket-king');

require('common/trackers/navigation-tracker');

var REPEAT_AFTER_ERROR_TIMEOUT = 1000 * 60;

var app = {
    start: function () {
        sessionManager.startSession()
            .then(bucketKing.start)
            .then(pollAchievements)
            .catch(catchErrors);
    }
};

function catchErrors(data) {
    console.log('Fatal error: %o', data);
    timer.shot(app.start, REPEAT_AFTER_ERROR_TIMEOUT, app);
}

function pollAchievements() {
    timer.interval(function () {
        serverConnector.achievements().then(function (response) {
            console.log('response achievements: ' + JSON.stringify(response));
        });
    }, 5000);
}

app.start();
