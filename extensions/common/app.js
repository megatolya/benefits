'use strict';

var serverConnector = require('common/serverConnector');
var console = require('specific/console');

var app = {
    start: function () {
        console.log('starting application...');
        serverConnector.connect();
    }
};

app.start();
