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
        return api.get({method: 'whoami'});
    },

    token: function () {
        return api.get({method: 'token'});
    },

    rules: function () {
        return api.get({method: 'rules'});
    },

    achievements: function () {
        return api.get({method: 'achievements'});
    },

    dump: function () {
        return api.post({method: 'dump'});
    },

    connected: new Signal(),
    updated: new Signal()
};

module.exports = serverConnector;
