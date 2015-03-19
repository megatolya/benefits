/* global XPCOMUtils, Task, Downloads, Promise */

'use strict';

let Signal = require('common/Signal');

const {
    classes: Cc,
    interfaces: Ci,
    utils: Cu,
    results: Cr
} = Components;

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://gre/modules/Task.jsm');
Cu.import('resource://gre/modules/Downloads.jsm');
Cu.import("resource://gre/modules/Promise.jsm");

// TODO: Перейти на нормальный логгер
let console = Components.utils.import('resource://gre/modules/devtools/Console.jsm', {}).console;
function logger (msg) {
    console.log('>>> LOGGER: ' + msg);
}

let downloadsMonitor = {
    init: function (aCallback) {
        if (!(aCallback && typeof aCallback === 'function')) {
            throw new Error('Callback should be a function.');
        }

        this._callback = aCallback;
    },

    finalize: function () {
        this.stopObserveDownloads();

        this._callback = null;
    },

    startObserveDownloads: function () {
        this._obtainDownloadList().then(aDownloadList => {
            return aDownloadList.addView(this);
        });
    },

    stopObserveDownloads: function () {
        this._obtainDownloadList()
            .then(aDownloadList => {
                return aDownloadList.removeView(this);
            })
            .catch(aError => logger('Removing observer failed. ' + aError));
    },

    /**
     * Возвращает Promise, заполняющийся массивом всех загрузок текущей сессии браузера.
     *
     * @returns Promise<Array<Download>>
     */
    getAllDownloads: function () {
        return Task.spawn(function *() {
            let list = yield this._obtainDownloadList();

            return yield list.getAll();
        }.bind(this));
    },

    /**
     * Возвращает Promise, заполняющийся массивом всех незавершенных загрузок текущей сессии браузера.
     *
     * @returns Promise<Array<Download>>
     */
    getActiveDownloads: function () {
        return this.getAllDownloads().then(aDownloads => {
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

    _downloadList: null,

    /**
     * Возвращает Promise, который заполнится объектом типа DownloadList при успешном выполнении.
     *
     * @returns Promise<DownloadList>
     */
    _obtainDownloadList: function () {
        if (!this._downloadList) {
            this._downloadList = Downloads.getList(Downloads.ALL).catch(aError => {
                logger('Can\'t get DownloadsList. ' + aError);

                this._downloadList = null;

                return Promise.reject(aError);
            });
        }

        return this._downloadList;
    }
};

let downloadsMonitorWrapper = function () {
    let active = false;

    // downloadStarted должно включать в себя firstRun, restart.
    // downloadStopped будет включать в себя success, error, canceled.
    let signalNames = ['downloadStarted', 'downloadStopped'];
    let signals = {};

    function setupEventDispatchers () {
        signalNames.forEach(aSignalName => {
            let signal = new Signal(
                // FIXME: При сборке не проходит проверку
                // ({isNew}) => {}

                info => {
                    if (info.isNew) {
                        // FIXME: Что делать, если promise в startObserveDownloads failed?
                        downloadsMonitor.startObserveDownloads();
                    }
                },
                info => {
                    if (info.isLast) {
                        downloadsMonitor.stopObserveDownloads();
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

    function wrapDownload (aDownload) {
        return {
            url: aDownload.source.url
        };
    }

    function DownloadWrapper (aDownload) {}

    let module = {
        // FIXME: Нужно ли это свойство?
        get name() {
            return 'downloadsMonitor';
        },

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

                downloadsMonitor.init((aEventType, aDownload) => {
                    // TODO: Переделать на new DownloadWrapper(aDownload);
                    let download = wrapDownload(aDownload);

                    switch (aEventType) {
                        case 'firstRun':
                            this.downloadStarted(download, 'firstRun');
                            break;

                        case 'restart':
                            this.downloadStarted(download, 'restart');
                            break;

                        case 'canceled':
                            this.downloadStopped(download, 'canceled');
                            break;

                        case 'completed':
                            this.downloadStopped(download, 'success');
                            break;

                        case 'failed':
                            this.downloadStopped(download, 'error');
                            break;

                        default:
                            return;
                    }
                });

                active = true;
            }
        },

        finalize: function () {
            if (active) {
                unsetEventDispatchers.call(this);

                active = false;
            }

            downloadsMonitor.finalize();
        },

        /**
         * Вызывает переданную функцию с массивом всех загрузок, хранящихся в истории браузера.
         *
         * @param {downloadsCallback} aCallback
         */
        getAllHistoryDownloads: function (aCallback) {
            // TODO: Сделать получение загрузок из истории браузера через Places.

//            let sqlstr = 'SELECT title FROM moz_places WHERE id IN (SELECT place_id FROM moz_historyvisits WHERE visit_type = 7)';
//            var conn = PlacesUtils.history.QueryInterface(Ci.nsPIPlacesDatabase).DBConnection;
//            var stmt = conn.createAsyncStatement(sqlstr);
        },

        /**
         * Вызывает переданную функцию с массивом всех загрузок текущей сессии браузера.
         *
         * @param {allSessiondownloadsCallback} aCallback
         */
        getAllDownloads: function (aCallback) {
            // FIXME
            Components.utils.reportError('ROMAN# downloads.js; getAllDownloads;');

            if (typeof aCallback !== 'function') {
                throw new Error('Callback should be a function.');
            }

            // TODO: Возвращать не массив объектов instanceof Download, а массив оберток.
            downloadsMonitor.getAllDownloads()
                .then(
                    aCallback,
                    aError => aCallback()
                );
        },

        /**
         * Вызывает переданную функцию с массивом всех незавершенных загрузок текущей сессии браузера.
         *
         * @param {downloadsCallback} aCallback
         */
        getActiveDownloads: function (aCallback) {
            if (typeof aCallback !== 'function') {
                throw new Error('Callback should be a function.');
            }

            downloadsMonitor.getActiveDownloads()
                .then(
                    aCallback,
                    aError => aCallback()
                );
        }
    };

    module.init();

    return module;
}();

// TODO: Использовать только один @callback downloadsCallback
/**
 * @callback allSessiondownloadsCallback
 *
 * @param {Array<Download>|Null} downloadsList:
 *      Array<Download> - массив загрузок;
 *      Null - в случае ошибки
 */

/**
 * @callback downloadsCallback
 *
 * @param {Array<Object>|Null} downloadsList:
 *      Array<Object> - массив объектов, хранящих информацию о загрузке;
 *      Null - в случае ошибки
 */

module.exports = downloadsMonitorWrapper;
