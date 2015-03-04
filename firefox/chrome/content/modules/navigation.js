'use strict';

var signals = require('signals');

const {
    classes: Cc,
    interfaces: Ci,
    utils: Cu,
    results: Cr
} = Components;

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');

let navigationMonitor = {
    init: function (aCallback) {
        if (!(aCallback && typeof aCallback === 'function')) {
            throw new Error('navigationMonitor callback should be a function.');
        }

        this._callback = aCallback;

        this._injectToBrowser();
    },

    finalize: function () {
        this._ejectFromBrowser();

        this._callback = null;
    },

    onOpenWindow: function (aWindow) {
        aWindow
            .QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindow)
            .addEventListener('load', this, false);
    },

    onLocationChange: function(aBrowser, aWebProgress, aRequest, aURI, aFlag) {
        let domWindow = aWebProgress.DOMWindow;
        let prevURL = this._domWindowNavigatedUrlMap.get(domWindow);
        let onlyHashChanged = false;
        let referrer = null;

        if (domWindow) {
            referrer = domWindow.document && domWindow.document.referrer;
        }

        let [url, hash] = aURI.spec.split('#');
        this._domWindowNavigatedUrlMap.set(domWindow, url);

        let sameDocument = (aFlag & Ci.nsIWebProgressListener.LOCATION_CHANGE_SAME_DOCUMENT);
        if (sameDocument && (prevURL === url)) {
            onlyHashChanged = true;
        }

        if (sameDocument && !onlyHashChanged) {
            referrer = prevURL;
        }

        let navigationData = {
            tab: aBrowser,
            domWindow: domWindow,
            isTopLevel: aWebProgress.isTopLevel,
            onlyHashChanged: onlyHashChanged,
            url: aURI,
            referrer: referrer
        };

        this._callback(navigationData);
    },

    handleEvent: function (aEvent) {
        switch (aEvent.type) {
            case 'load':
                this._onXULWindowLoad(aEvent.currentTarget);
                break;

            default:
                return;
        }
    },

    _callback: null,
    _domWindowNavigatedUrlMap: new WeakMap(),

    _injectToBrowser: function () {
        let windows = Services.wm.getEnumerator('navigator:browser');

        while (windows.hasMoreElements()) {
            this._startMonitorWindowWebProgress(windows.getNext());
        }

        Services.wm.addListener(this);
    },

    _ejectFromBrowser: function () {
        Services.wm.removeListener(this);

        let windows = Services.wm.getEnumerator('navigator:browser');

        while (windows.hasMoreElements()) {
            this._stopMonitorWindowWebProgress(windows.getNext());
        }
    },

    _onXULWindowLoad: function (aWindow) {
        aWindow.removeEventListener('load', this, false);

        if (aWindow.document.documentElement.getAttribute('windowtype') !== 'navigator:browser') {
            return;
        }

        this._startMonitorWindowWebProgress(aWindow);
    },

    _startMonitorWindowWebProgress: function (aWindow) {
        aWindow.getBrowser().addTabsProgressListener(this);
    },

    _stopMonitorWindowWebProgress: function (aWindow) {
        aWindow.getBrowser().removeTabsProgressListener(this);
    },

    QueryInterface: XPCOMUtils.generateQI(['nsIWebProgressListener', 'nsISupportsWeakReference']),
};

let navigationMonitorWrapper = {
    locationChanged: new signals.Signal(),

    start: function () {
        navigationMonitor.init(aNavigationData => this.locationChanged.dispatch(aNavigationData));
    },

    stop: function () {
        this.locationChanged.removeAll();

        navigationMonitor.finalize();
    }
};

module.exports = navigationMonitorWrapper;
