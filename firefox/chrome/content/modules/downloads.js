'use strict';

let signals = require('signals');

const {
    classes: Cc,
    interfaces: Ci,
    utils: Cu,
    results: Cr
} = Components;

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://gre/modules/Downloads.jsm');
Cu.import('resource://gre/modules/Task.jsm');

// TODO: Перейти на нормальный логгер
let console = Components.utils.import('resource://gre/modules/devtools/Console.jsm', {}).console;
function logger (msg) {
    console.log('>>> LOGGER: ' + msg);
}

let downloadsMonitor = {
    /**
     * Возвращает число незавершенных загрузок текущей сессии браузера.
     *
     * @returns Number
     */
    get activeDownloadsNumber() {
        return this.__activeDownloadsNumber;
    },

    init: function (aCallback) {
        return new Promise((aResolve, aReject) => {
            if (!(aCallback && typeof aCallback === 'function')) {
                throw new Error('Callback should be a function.');
            }

            this._callback = aCallback;

            this._initializationReject = aReject;

            if (typeof this.activeDownloadsNumberChanged === 'undefined') {
                XPCOMUtils.defineLazyGetter(this, 'activeDownloadsNumberChanged', () => new signals.Signal());
            }

            this._obtainDownloadsList()
                .then(() => aResolve(), (aError) => aReject(aError));
        }).catch(aError => {
            logger('Error during finalization.' + aError);

            this.finalize();
        });
    },

    finalize: function () {
        if (typeof this._initializationReject === 'function') {
            this._initializationReject('Finalization');

            this._initializationReject = null;
        }

        this._stopObserveDownloads();

        this._callback = null;
    },

    /**
     * Возвращает промис, который заполнится массивом всех незавершенных загрузок текущей сессии браузера.
     *
     * @returns Promise<Array<Downloads>>
     */
    getActiveDownloads: function () {
        return Task.spawn(function *() {
            let list = this._getDownloadsList();

            return yield downloadsList.getAll();
        }).then(aDownloads => {
            return aDownloads.filter(aDownload => !aDownload.stopped);
        });
    },

    onDownloadAdded: function (aDownload) {
        let debug = {
            canceled: aDownload.canceled,
            contentType: aDownload.contentType,
            error: aDownload.error,
            hasProgress: aDownload.hasProgress,
            progress: aDownload.progress,
            currentBytes: aDownload.currentBytes,
            source: aDownload.source.url,
            stopped: aDownload.stopped,
            succeeded: aDownload.succeeded,
            target: aDownload.target.path
        };
        console.log('aDownload ADDED; debug=' + JSON.stringify(debug, null, 2));

        // TODO: Реализовать проверку состояния промиса,
        // вызовы соответствующих callback'ов и актуализацию количества незавершенных
//        this._callback('started', aDownload);
    },

    onDownloadChanged: function (aDownload) {
        let debug = {
            canceled: aDownload.canceled,
            contentType: aDownload.contentType,
            error: aDownload.error,
            hasProgress: aDownload.hasProgress,
            progress: aDownload.progress,
            currentBytes: aDownload.currentBytes,
            source: aDownload.source.url,
            stopped: aDownload.stopped,
            succeeded: aDownload.succeeded,
            target: aDownload.target.path
        };
        console.log('aDownload CHANGED; debug=' + JSON.stringify(debug, null, 2));

//        this._callback('changed', aDownload);
    },

    onDownloadRemoved: function (aDownload) {
        console.log('aDownload REMOVED; aDownload.source=' + aDownload.source.url);

//        this._callback('removed', aDownload);
    },

    _initializationReject: null,
    _downloadsList: null,
    __activeDownloadsNumber: 0,

    set _activeDownloadsNumber(aValue) {
        let previousValue = this.__activeDownloadsNumber;

        this.__activeDownloadsNumber = aValue;

        this.activeDownloadsNumberChanged.dispatch(aValue, previousValue);
    },

    _obtainDownloadsList: function () {
        let promise = null;

        if (this._downloadsList) {
            promise = Promise.resolve();
        } else {
            promise = Downloads.getList(Downloads.ALL).then(aList => this._downloadsList = aList);
        }

        return promise;
    },

    _getDownloadsList: function () {
        return this._downloadsList;
    },

    // TODO: Добавить вызов этой функции, когда появляются подписчики
    // (сигналы не подходят, потому что судя по документации не умеют оповещать о подписке)
    _startObserveDownloads: function () {
        let list = this._getDownloadsList();
        if (!list) {
            throw new Error('No downloads list. Couldn\'t observer downloads.');
        }

        list.addView(this)
            .catch(aError => {
                let errorMsg = 'Adding observer failed. ' + aError;

                logger(errorMsg);

                throw new Error('Adding observer failed. ' + aError);
            });
    },

    _stopObserveDownloads: function () {
        let list = this._getDownloadsList();
        if (!list) {
            return;
        }

        list.removeView(this)
            .catch(aError => logger('Removing observer failed. ' + aError));
    }
};

let downloadsMonitorWrapper = function () {
    let active = false;

    // downloadStarted должно включать в себя firstRun, restart.
    // downloadStopped будет включать в себя success, error, canceled.
    let eventNames = ['downloadStarted', 'downloadStopped'];

    function setupEventsDispatchers () {
        eventNames.forEach(aSignalName => {
            XPCOMUtils.defineLazyGetter(this, aSignalName, () => new signals.Signal());
        });
    }

    function unsetEventsDispatchers () {
        eventNames.forEach(aSignalName => {
            if (this[aSignalName]) {
                this[aSignalName].removeAll();
                delete this[aSignalName];
            }
        });
    }

    let initializationPromise = null;

    let module = {
        get name() {
            return 'downloadsMonitor';
        },

        /**
         * Возвращает массив имен доступных событий объекта.
         *
         * @returns {Array<String>}
         */
        get availableEvents() {
            return Array.slice(eventsNames);
        },

        __init: function (aCallback) {
            if (!active) {
                setupEventsDispatchers.call(this);

                active = true;
            }

            if (!initializationPromise) {
                initializationPromise = downloadsMonitor.init((aEvent, aData) => {
                    let downloadDescription = {
                        url: aData.source.url
                    };

                    switch (aEvent) {
                        case 'firstRun':
                            this.downloadStarted(downloadDescription, 'firstRun');
                            break;

                        case 'restart':
                            this.downloadStarted(downloadDescription, 'restart');
                            break;

                        case 'canceled':
                            this.downloadStopped(downloadDescription, 'canceled');
                            break;

                        case 'completed':
                            this.downloadStopped(downloadDescription, 'success');
                            break;

                        case 'failed':
                            this.downloadStopped(downloadDescription, 'error');
                            break;

                        default:
                            return;
                    }
                }).catch(aError => {
                    logger('Initialization failed. ' + aError);

                    this.__finalize();
                });
            }

            initializationPromise.then(() => aCallback(), aError => aCallback(aError));
        },

        __finalize: function () {
            if (active) {
                unsetEventsDispatchers.call(this);

                active = false;
            }

            if (initializationPromise) {
                initializationPromise = null;
            }

            downloadsMonitor.finalize();
        },

        /**
         * Возвращает массив всех загрузок браузера.
         *
         * @param {allDownloadsCallback} aCallback
         */
        getAllHistoryDownloads: function (aCallback) {
            // TODO: Сделать получение загрузок из истории браузера через Places.

//            let sqlstr = 'SELECT title FROM moz_places WHERE id IN (SELECT place_id FROM moz_historyvisits WHERE visit_type = 7)';
//            var conn = PlacesUtils.history.QueryInterface(Ci.nsPIPlacesDatabase).DBConnection;
//            var stmt = conn.createAsyncStatement(sqlstr);
        },

        /**
         * Возвращает массив всех загрузок текущей сессии браузера.
         *
         * @param {allSessionDownloadsCallback} aCallback
         */
        getAllSessionDownloads: function (aCallback) {
            if (typeof aCallback !== 'function') {
                throw new Error('Callback should be a function.');
            }

            // TODO: Возвращать не массив объектов instanceof Download, а массив оберток.
            downloadsMonitor.getActiveDownloads()
                .then(aDownloadsArray => aCallback(aDownloadsArray), aError => aCallback());
        }
    };

    return module;
}();

/**
 * @callback allSessionDownloadsCallback
 *
 * @param {Array<Download>|Null} downloadsList:
 *      Array<Download> - массив загрузок;
 *      Null - в случае ошибки
 */

/**
 * @callback allDownloadsCallback
 *
 * @param {Array<Object>|Null} downloadsList:
 *      Array<Object> - массив объектов, хранящих информацию о загрузке;
 *      Null - в случае ошибки
 */

module.exports = downloadsMonitorWrapper;
