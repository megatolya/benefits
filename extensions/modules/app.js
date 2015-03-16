'use strict';

var serverConnector = require('./serverConnector');
var navigationMonitor = require('../impl/navigation');
var downloadsMonitor = require('../impl/downloads');
var console = require('../impl/console');

var GLOBAL = this;

var app = {
    start: function () {
        console.log('starting application...');

        // TODO: Убрать эту функцию, модули будут импортироваться там, где они нужны,
        // клиенты сами будут ожидать инициализации через callback.
        this._initModules();
    },

    // TODO: firefox Как-то научиться вызывать finalize из bootstrap.js
    finalize: function () {

    },

    _initModules: function () {
        // TODO удалить зависимости от initializer
        // initializer.initModules([downloadsMonitor], function (errorStatus) {
        //    if (errorStatus) {
        //        console.log('DownloadsMonitor initialization failed. ' + errorStatus);
        //    } else {
        //        console.log('DownloadsMonitor initialization succeed.');
        //    }
        // });
        //
        // navigationMonitor.start();
    }
};

app.start();
