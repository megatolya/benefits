'use strict';

var serverConnector = require('common/serverConnector');
var sessionManager = require('common/sessionManager');
var console = require('specific/console');

var app = {
    start: function () {
        sessionManager.startSession();
            // .then(serverConnector.rules())
            // .then(serverConnector.achievements());
    }
};

app.start();
