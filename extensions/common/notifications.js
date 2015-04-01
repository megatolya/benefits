'use strict';

var platformNotifications = require('specific/notifications');
var achievements = require('common/achievements');

achievements.unlocked.add(onAchievementsUnlocked);

var defaultOptions = {
    iconUrl: 'images/notification-icon.png',
    imageUrl: 'images/notification-unlocked.png',
    title: 'Achievement unlocked!',
    message: 'Social maniac',
    contextMessage: 'This achievement is awesome! (actually not)'
};

function onAchievementsUnlocked(achivements) {
    if (!Array.isArray(achivements)) {
        return;
    }
    achivements.forEach(notifications.showForAchievement, notifications);
}

function createOptionsForAchievement(achievement) {
    return mergeOptions({
        message: achievement.name,
        imageUrl: achievement.imageUrl,
        contextMessage: achievement.description
    }, defaultOptions);
}

function mergeOptions(specific, defaults) {
    for (var key in defaults) {
        if (defaults.hasOwnProperty(key) && specific[key] === undefined) {
            specific[key] = defaults[key];
        }
    }
    return specific;
}

var notifications = {
    show: function (options) {
        console.log('Notification options: %o', options);
        platformNotifications.show(options);
    },

    showForAchievement: function (achievement) {
        this.show(createOptionsForAchievement(achievement));
    }
};

module.exports = notifications;
