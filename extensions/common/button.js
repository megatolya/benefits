'use strict';

var platformButton = require('specific/button');
var Signal = require('common/signal');
var achievements = require('common/achievements');

achievements.updated.add(onAchievementsUpdated);
platformButton.updateCounter('');

function onAchievementsUpdated(achievements) {
    if (!Array.isArray(achievements)) {
        return;
    }
    platformButton.updateCounter(achievements.length || '');
    button.count = achievements.length;
}

var button = {
    count: 0
};

module.exports = button;
