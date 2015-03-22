'use strict';

var serverConnector = require('common/serverConnector');
var sessionManager = require('common/sessionManager');
var console = require('specific/console');
var bucketKing = require('common/bucketKing');

require('common/navigationTracker');

var app = {
    start: function () {
        sessionManager.startSession()
            .then(bucketKing.start);
    }
};

app.start();

setInterval(function () {
    serverConnector.achievements().then(function (response) {
        console.log('-----------------------------------');
        console.log('response achievements: ' + JSON.stringify(response));
        console.log('-----------------------------------');
    });
}, 15000);
