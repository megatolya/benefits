'use strict';

var serverConnector = require('./serverConnector');
var navigationMonitor = require('./navigation');
var console = require('./console');

navigationMonitor.init();

navigationMonitor.locationChanged.add(function (aData) {
    console.log('SIGNAL: navigationMonitor.locationChanged; url=' + aData.url.spec + '; onlyHashChanged=' + aData.onlyHashChanged);
});

serverConnector.connected.add(function() {
    console.log('connnected from signal!!!');
});

serverConnector.connect();
