'use strict';

var console = require('specific/console');
var serverConnector = require('common/server-connector');
serverConnector.updated.add(onReceivedDataFromServer);

var handlers = {};

function onReceivedDataFromServer(data) {
    var rules = data.rules;
    if (!rules) {
        return;
    }
    notifyHandlers(rules);
}

function notifyHandlers(rules) {
    for (var key in rules) {
        if (rules.hasOwnProperty(key)) {
            callHandlerForRuleName(key, rules[key]);
        }
    }
}

function callHandlerForRuleName(ruleName, rules) {
    var handler = handlers[ruleName];
    if (handler) {
        handler(rules);
    }
}

module.exports = {
    start: function () {
        console.log('Bucket King: start');
        serverConnector.rules();
    },

    register: function (name, handler) {
        handlers[name] = handler;
    }
};
