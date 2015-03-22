'use strict';

var serverConnector = require('common/serverConnector');
serverConnector.rulesUpdated.add(onRulesUpdated);

var handlers = {};

function onRulesUpdated(rules) {
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
    register: function (name, handler) {
        handlers[name] = handler;
    }
};
