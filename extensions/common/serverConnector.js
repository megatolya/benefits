'use strict';

var console = require('specific/console');
var Signal = require('common/signal');

console.log('hello world from serverConnector');

var serverConnector = {
    connect: function () {
        console.log('connected!');
        this.connected.dispatch();
    },

    connected: new Signal()
};

module.exports = serverConnector;
