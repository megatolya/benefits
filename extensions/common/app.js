'use strict';

var serverConnector = require('./serverConnector');
var console = require('../impl/console');

var app = {
    start: function () {
        console.log('starting application...');
        serverConnector.connect();
    }
};

app.start();
