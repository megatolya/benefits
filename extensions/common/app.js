'use strict';

var serverConnector = require('common/serverConnector');
var sessionManager = require('common/sessionManager');
var console = require('specific/console');

var app = {
    start: function () {
        this._startSession().then(function () {
            console.log('Session started'
                + '; uid=' + sessionManager.getUID()
                + '; token=' + sessionManager.getToken()
                + '; salt=' + sessionManager.getSalt()
            );
        });
    },

    _startSession: function () {
        return serverConnector.whoami().catch(function (error) {
            // FIXME: Использовать логгер
            console.log('Start session failed. ' + error);

            return Promise.reject(error);
        });
    }
};

app.start();
