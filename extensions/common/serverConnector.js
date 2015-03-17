'use strict';

var console = require('../specific/console');
var signals = require('signals');

console.log('hello world from serverConnector');

var serverConnector = {
    connect: function () {
        console.log('connected!');
        this.connected.dispatch();
    },

    connected: new signals.Signal()
};

module.exports = serverConnector;
