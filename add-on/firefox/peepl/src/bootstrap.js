'use strict';

const {
    classes: Cc,
    interfaces: Ci,
    results: Cr,
    utils: Cu
    } = Components;

Cu.import("resource://gre/modules/Services.jsm");

const APP_NAME = 'peepl';

let core = {
    get app() {
        return this._application;
    },

    init: function () {
        // FIXME: Переименовать в loadLibraryModules?
        this._loadModules();
        this._loadApplication();
    },

    finalize: function () {
        this._unloadApplication();
        this._unloadModules();
    },

    _loadModules: function () {

    },

    _unloadModules: function () {

    },

    _loadApplication: function () {
        let scope = {};
        Cu.import('chrome://' + APP_NAME + '/content/application.jsm', scope);

        this._application = scope.application;
        if (typeof this._application.init === 'function') {
            this._application.init(this);
        }
    },

    unloadApplication: function () {
        if (typeof this._application.finalize === 'function') {
            this._application.finalize();
        }

        this._application = null;
    }
}

function startup (aData, aReason) {
    core.init();
}

function shutdown (aData, aReason) {
    core.finalize();
}

function install (aData, aReason) {

}

function uninstall (aData, aReason) {
    if (aReason !== ADDON_UNINSTALL) {
        return;
    }
}
