'use strict';

var serverConnector = require('common/server-connector');
var console = require('specific/console');
var timer = require('specific/timer');
var storage = require('common/storage');
var Signal = require('common/signal');

var ACHIEVEMENTS_POLL_TIMEOUT = 1000 * 10;
var ACHIEVEMENTS_STORAGE_KEY = 'achievements';

var pollInterval = null;

function logErrors(error) {
    console.log('Achievements error: %o', error);
}

var achievements = {
    start: function () {
        if (pollInterval) {
            pollInterval.cancel();
        }
        pollInterval = timer.interval(
            this.update.bind(this),
            ACHIEVEMENTS_POLL_TIMEOUT,
            this
        );
        this.update();
    },

    update: function () {
        return serverConnector.achievements()
            .then(this.parse.bind(this))
            .then(this.save.bind(this))
            .then(this.updated.dispatch.bind(this.updated))
            .catch(logErrors);
    },

    parse: function (data) {
        return data ? data.achievements : [];
    },

    save: function (achievements) {
        storage.set(ACHIEVEMENTS_STORAGE_KEY, achievements);
        return achievements;
    },

    updated: new Signal()
};

module.exports = achievements;
