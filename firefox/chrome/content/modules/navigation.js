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
    locationChanged: new signals.Signal(),

    init: function () {
        this._injectToBrowser();

        webProgressListener.locationChanged.add(this._onLocationChange, this);
    },

    finalize: function () {
        this._ejectFromBrowser();

        webProgressListener.locationChanged.remove(this._onLocationChange, this);

        this.locationChanged.removeAll();
    },

    onOpenWindow: function (aWindow) {
        aWindow
            .QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindow)
            .addEventListener('load', this, false);
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
        aWindow.getBrowser().addTabsProgressListener(webProgressListener);
    },

    _stopMonitorWindowWebProgress: function (aWindow) {
        aWindow.getBrowser().removeTabsProgressListener(webProgressListener);
    },

    _onLocationChange: function (aData) {
        this.locationChanged.dispatch(aData);
    }
};

let webProgressListener = {
    locationChanged: new signals.Signal(),

    onLocationChange: function(aBrowser, aWebProgress, aRequest, aURI, aFlag) {
        let prevURL = this._tabURLsMap.get(aBrowser);
        let onlyHashChanged = false;

        let [url, hash] = aURI.spec.split('#');
        this._tabURLsMap.set(aBrowser, url);

        let sameDocument = (aFlag & Ci.nsIWebProgressListener.LOCATION_CHANGE_SAME_DOCUMENT);
        if (sameDocument && prevURL) {
            if (prevURL === url) {
                onlyHashChanged = true;
            }
        }

        let navigationData = {
            tab: aBrowser,
            url: aURI,
            isTopLevel: aWebProgress.isTopLevel,
            onlyHashChanged: onlyHashChanged
        };

        this.locationChanged.dispatch(navigationData);
    },

    QueryInterface: XPCOMUtils.generateQI(['nsIWebProgressListener', 'nsISupportsWeakReference']),

    _tabURLsMap: new WeakMap()
};

module.exports = navigationMonitor;
