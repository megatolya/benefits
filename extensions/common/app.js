'use strict';

var serverConnector = require('common/serverConnector');
var sessionManager = require('common/sessionManager');
var console = require('specific/console');
var timer = require('specific/timer');
var bucketKing = require('common/bucketKing');

require('common/navigationTracker');

var app = {
    start: function () {
        sessionManager.startSession()
            .then(bucketKing.start);
    }
};

app.start();

timer.interval(function () {
    serverConnector.achievements().then(function (response) {
        console.log('-----------------------------------');
        console.log('response achievements: ' + JSON.stringify(response));
        console.log('-----------------------------------');
    });
}, 5000);
