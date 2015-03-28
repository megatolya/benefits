'use strict';

var notifications = {
    show: function (options) {
        chrome.notifications.create(null, {
            type: 'image',
            iconUrl: options.iconUrl,
            title: options.title,
            message: options.message,
            contextMessage: options.contextMessage,
            imageUrl: options.imageUrl
        });
    }
};

module.exports = notifications;
