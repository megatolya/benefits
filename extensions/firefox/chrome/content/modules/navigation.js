/* global Services, XPCOMUtils */

'use strict';

let Signal = require('common/Signal');

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
    },

    finalize: function () {
        this.stopObserve();

        this._callback = null;
    },

    startObserve: function () {
        this._injectToBrowser();
    },

    stopObserve: function () {
        this._ejectFromBrowser();
    },

    onOpenWindow: function (aWindow) {
        aWindow
            .QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindow)
            .addEventListener('load', this, false);
    },

    onLocationChange: function(aBrowser, aWebProgress, aRequest, aURI, aFlag) {
        if (!aURI) {
            return;
        }

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
            url: url,
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

let navigationMonitorWrapper = function () {
    let active = false;

    let signalNames = ['locationChanged'];
    let signals = {};

    function setupEventDispatchers () {
        signalNames.forEach(aSignalName => {
            let signal = new Signal(
                info => {
                    if (info.isNew) {
                        // FIXME: Обрабатывать ошибку при подписке
                        navigationMonitor.startObserve();
                    }
                },
                info => {
                    if (info.isLast) {
                        navigationMonitor.stopObserve();
                    }
                }
            );

            signals[aSignalName] = signal;
            XPCOMUtils.defineLazyGetter(this, aSignalName, () => signal);
        });
    }

    function unsetEventDispatchers () {
        signalNames.forEach(aSignalName => {
            let signal = signals[aSignalName];
            if (signal) {
                signal.removeAll();
            }

            delete signals[aSignalName];
            delete this[aSignalName];
        });
    }

    let module = {
        /**
         * Возвращает массив имен доступных событий объекта.
         *
         * @returns {Array<String>}
         */
        get availableEvents() {
            return Array.slice(signalNames);
        },

        init: function () {
            if (!active) {
                setupEventDispatchers.call(this);

                navigationMonitor.init(aNavigationData => this.locationChanged.dispatch(aNavigationData));

                active = true;
            }
        },

        finalize: function () {
            if (active) {
                unsetEventDispatchers.call(this);

                navigationMonitor.finalize();

                active = false;
            }
        }
    };

    module.init();

    return module;
}();

module.exports = navigationMonitorWrapper;
