'use strict';

const {
    classes: Cc,
    interfaces: Ci,
    results: Cr,
    utils: Cu
    } = Components;

Cu.import("resource://gre/modules/Services.jsm");

const APP_NAME = 'peepl';
const APP_CHROME_PATH = 'chrome://' + APP_NAME + '/content/'

let core = {
    get appName() {
        return APP_NAME;
    },

    init: function () {
        this._loadModules();
        this._loadUIManager();
        this._loadApplication();
    },

    finalize: function () {
        this._unloadApplication();
        this._unloadUIManager();
        this._unloadModules();
    },

    // FIXME: Скорее всего здесь будет загрузка модулей общих и специфичных,
    // application.js будет в общем коде.
    // Здесь же можно написать функцию require, которая будет отдавать core[moduleName],
    // используемую в application.js.
    _loadModules: function () {

    },

    _unloadModules: function () {

    },

    _loadUIManager: function () {
        this._uiManager = this._importModules('ui.jsm', ['uiManager']).uiManager;

        if (typeof this._uiManager.init === 'function') {
            this._uiManager.init(this);
        }
    },

    _unloadUIManager: function () {
        if (typeof this._uiManager.finalize === 'function') {
            this._uiManager.finalize(this);
        }

        this._uiManager = null;
    },

    _loadApplication: function () {
        this._importModules('application.jsm');
    },

    _unloadApplication: function () {
        Cu.unload(APP_CHROME_PATH + 'application.jsm');
    },

    /**
     * Импортирует модули расположенные по адресу chrome://<add-on name>/content.
     *
     * @param {String} aFilePath - путь до файла относительно корня chrome/content
     * @param {[]String|Undefined} aModuleNames - имена импортируемых модулей или ничего,
     *      чтобы импортировать все модули из файла.
     *
     * @returns {Object} - объект, ключи которого названия модулей, значения - модули
     */
    _importModules: function (aFilePath, aModuleNames = []) {
        let scope = {};
        Cu.import(APP_CHROME_PATH + aFilePath, scope);

        if (!aModuleNames.length) {
            return scope;
        }

        return Object.keys(scope)
            .filter(aModuleName => aModuleNames.indexOf(aModuleName) > -1)
            .reduce((aResultObject, aModuleName) => {
                    aResultObject[aModuleName] = scope[aModuleName];

                    return aResultObject;
                },
                {}
            );
    }
}

function startup (aData, aReason) {
    core.init();
}

function shutdown (aData, aReason) {
    // FIXME: finalize нужно вызывать в любом случае, не нужно удалять UI, если причина APP_SHUTDOWN.
    if (aReason == APP_SHUTDOWN) {
        return;
    }

    core.finalize();
}

function install (aData, aReason) {

}

function uninstall (aData, aReason) {
    if (aReason !== ADDON_UNINSTALL) {
        return;
    }
}

