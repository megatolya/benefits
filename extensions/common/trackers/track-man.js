'use strict';

var serverConnector = require('common/server-connector');
var console = require('specific/console');
var timer = require('specific/timer');

var SEND_DUMP_TIMEOUT = 15000;

var handlers = {};

timer.interval(sendDump, SEND_DUMP_TIMEOUT);

function sendDump() {
    var dumpData = collectDumpData();
    console.log('dumpData: ', dumpData);
    if (dumpData) {
        serverConnector.dump(dumpData);
    }
}

function collectDumpData() {
    var dumpData = {};
    for (var key in handlers) {
        if (handlers.hasOwnProperty(key)) {
            merge(dumpData, handlers[key]());
        }
    }
    return dumpData;
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
