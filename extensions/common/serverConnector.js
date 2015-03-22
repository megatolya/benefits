'use strict';

var console = require('specific/console');
var Signal = require('common/signal');
var api = require('common/api');

function handleRulesResponse(response) {
    if (response && response.rules) {
        serverConnector.rulesUpdated.dispatch(response.rules);
    }
}

function handleAchievementsResponse(response) {
    if (response && response.achievements) {
        serverConnector.achievementsUpdated.dispatch(response.achievements);
    }
}

function handleDumpResponse(response) {
    handleAchievementsResponse(response);
    handleRulesResponse(response);
}

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
        return api.get({method: 'rules'}).then(handleRulesResponse);
    },

    achievements: function () {
        return api.get({method: 'achievements'}).then(handleAchievementsResponse);
    },

    dump: function (body) {
        return api.post({method: 'dump', body: body}).then(handleDumpResponse);
    },

    rulesUpdated: new Signal(),
    achievementsUpdated: new Signal()
};

module.exports = serverConnector;
