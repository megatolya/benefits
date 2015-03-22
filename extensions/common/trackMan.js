'use strict';

var serverConnector = require('common/serverConnector');

var SEND_DUMP_TIMEOUT = 30000;

var handlers = {};

setTimeout(sendDump, SEND_DUMP_TIMEOUT);

function sendDump() {
    var dumpData = {};
    for (var key in handlers) {
        if (handlers.hasOwnProperty(key)) {
            merge(dumpData, handlers[key]());
        }
    }
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
