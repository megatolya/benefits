'use strict';

var serverConnector = require('common/server-connector');
var sessionData = require('common/session-data');
var console = require('specific/console');

function handleWhoamiError(error) {
    // FIXME: Использовать логгер
    console.log('Start session failed. ' + error);
    return Promise.reject(error);
}

function handleWhoamiResponse(response) {
    var data = response.whoami;
    console.log('Whoami response: ' + JSON.stringify(data));
    sessionData.setUID(data.uid);
    sessionData.setSalt(data.salt);
}

module.exports = {
    startSession: function () {
        if (sessionData.getSalt() && sessionData.getUID()) {
            console.log('Session already exist');
            return Promise.resolve();
        }
        return serverConnector.whoami()
            .then(handleWhoamiResponse)
            .catch(handleWhoamiError);
    }
};
