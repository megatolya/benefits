'use strict';

var serverConnector = require('common/serverConnector');
var console = require('specific/console');
var timers = require('specific/timers');

var SEND_DUMP_TIMEOUT = 15000;

var handlers = {};

timers.setInterval(sendDump, SEND_DUMP_TIMEOUT);

function sendDump() {
    var dumpData = {};
    for (var key in handlers) {
        if (handlers.hasOwnProperty(key)) {
            merge(dumpData, handlers[key]());
        }
    }
    console.log('dumpData: ', dumpData);
    serverConnector.dump(dumpData);
}

function merge(parent, child) {
    if (!child) {
        return;
    }
    for (var key in child) {
        if (child.hasOwnProperty(key)) {
            parent[key] = child[key];
        }
    }
}

module.exports = {
    register: function (name, handler) {
        handlers[name] = handler;
    }
};
