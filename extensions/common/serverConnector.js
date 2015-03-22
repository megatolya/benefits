'use strict';

var console = require('specific/console');
var Signal = require('common/signal');
var api = require('common/api');

console.log('hello world from serverConnector');

var serverConnector = {
    connect: function () {
        console.log('connected!');
        this.connected.dispatch();
    },

    whoami: function () {
    },

    connected: new Signal(),
    updated: new Signal()
};

module.exports = serverConnector;
