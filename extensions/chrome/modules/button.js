'use strict';

var button = {
    updateCounter: function (count) {
        chrome.browserAction.setBadgeText({text: String(count)});
    }
};

module.exports = button;
