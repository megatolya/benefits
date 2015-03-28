'use strict';

var serverConnector = require('common/server-connector');
var sessionManager = require('common/session-manager');
var console = require('specific/console');
var timer = require('specific/timer');
var bucketKing = require('common/buckets/bucket-king');

require('common/trackers/navigation-tracker');

var app = {
    start: function () {
        sessionManager.startSession()
            .then(bucketKing.start);
    }
};

app.start();

timer.interval(function () {
    serverConnector.achievements().then(function (response) {
        console.log('response achievements: ' + JSON.stringify(response));
    });
}, 5000);
