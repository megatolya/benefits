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

function parseResponse(data) {
    return data ? data.achievements : [];
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
            .then(this._processResponse.bind(this))
            .catch(logErrors);
    },

    _processResponse: function (data) {
        var achievements = parseResponse(data);
        var unlockedAchievements = this.findUnlocked(achievements);
        this.save(achievements);
        this._notify('updated', achievements);
        this._notify('unlocked', unlockedAchievements);
    },

    _notify: function (type, achievements) {
        if (achievements && achievements.length > 0) {
            this[type].dispatch(achievements);
        }
    },

    findUnlocked: function (achievements) {
        var savedAchievements = this.get();
        if (Array.isArray(achievements) && Array.isArray(savedAchievements)) {
            return achievements.filter(function (achievement) {
                return this.isNew(achievement, savedAchievements);
            }, this);
        }
        return achievements;
    },

    isNew: function (achievement, savedAchievements) {
        for (var i = 0; i < savedAchievements.length; i++) {
            var savedAchivka = savedAchievements[i];
            if (savedAchivka.id === achievement.id) {
                return false;
            }
        }
        return true;
    },

    save: function (achievements) {
        storage.set(ACHIEVEMENTS_STORAGE_KEY, achievements);
        return achievements;
    },

    get: function () {
        return storage.get(ACHIEVEMENTS_STORAGE_KEY);
    },

    updated: new Signal(),
    unlocked: new Signal()
};

module.exports = achievements;
