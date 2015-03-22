'use strict';

var Signal = require('common/signal');

function onListenerAdded(data) {
    if (data.isNew) {
        chrome.tabs.onUpdated.addListener(onTabUpdated);
    }
}

function onListenerRemoved(data) {
    if (data.isLast) {
        chrome.tabs.onUpdated.removeListener(onTabUpdated);
    }
}

function onTabUpdated(tabId, changeInfo) {
    navigationModule.locationChanged.dispatch({
        url: changeInfo.url
    });
}

var navigationModule = {
    locationChanged: new Signal(onListenerAdded, onListenerRemoved)
};

module.exports = navigationModule;
