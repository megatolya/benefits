'use strict';

var serverConnector = require('common/server-connector');
var sessionData = require('common/session-data');
var console = require('specific/console');

function getSessionData() {
    return serverConnector.whoami()
        .then(handleWhoamiResponse)
        .catch(handleWhoamiError);
}

function checkSessionData() {
    return serverConnector.token()
        .then(handleTokenResponse)
        .catch(getSessionData);
}

function handleWhoamiError(error) {
    // FIXME: Использовать логгер
    console.log('Start session failed: %o', error);
    return Promise.reject(error);
}

function handleWhoamiResponse(response) {
    var data = response.whoami;
    if (!data) {
        return Promise.reject('Bad whoami response format');
    }
    sessionData.setUID(data.uid);
    sessionData.setSalt(data.salt);
    console.log('Whoami response: %o', data);
    return data;
}

function handleTokenResponse(response) {
    var data = response.token;
    if (!data || !data.authorized) {
        console.log('Not authorized. Clear data and call whoami');
        sessionData.clear();
        return getSessionData();
    }
    console.log('Token response: %o', data);
    return data;
}

var sessionManager = {
    startSession: function () {
        if (sessionData.getSalt() && sessionData.getUID()) {
            return checkSessionData();
        }
        return getSessionData();
    }
};

module.exports = sessionManager;
