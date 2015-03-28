'use strict';

var serverConnector = require('common/server-connector');
var console = require('specific/console');
var timer = require('specific/timer');

var SEND_DUMP_TIMEOUT = 15000;

var handlers = {};

timer.interval(sendDump, SEND_DUMP_TIMEOUT);

function sendDump() {
    var dumpData = collectDumpData();
    if (isNotEmpty(dumpData)) {
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

function isNotEmpty(data) {
    return data && Object.keys(data).length > 0;
}

module.exports = {
    register: function (name, handler) {
        handlers[name] = handler;
    }
};
