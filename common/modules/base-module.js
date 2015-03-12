/**
 * BaseModule contains initializing and finalizing methods
 * All modules should extends from BaseModule
 * If you want to do some special things in initialization/finalization,
 * your module should have init and finalize methods
 *
 * Usage:
 * If your module is a simple object:
 * var module = new BaseModule({
 *      a: 'test'
 *      ...
 * });
 *
 * If your module is a class:
 * var Module = function (...) {...}
 * Module.prototype = new BaseModule({
 *      a: 'test'
 *      ...
 * })
 *
 */
'use strict';

var BaseModule = function (child) {
    for (var key in child) {
        this[key] = child[key];
    }
};

BaseModule.prototype = {
    _rejectInitPromise: null,
    _initPromise: null,

    __init: function () {
        if (!this._initPromise) {
            this._initPromise = this._createInitPromise();
        }
        return this._initPromise;
    },

    __finalize: function () {
        this.finalize();
        this._rejectInitPromise = null;
        this._initPromise = null;
        safeCall(this._rejectInitPromise);
    },

    _createInitPromise: function() {
        return new Promise(function (resolve, reject) {
            this._rejectInitPromise = reject;
            this._callInit(resolve, reject);
        }.bind(this));
    },

    _callInit: function (resolve, reject) {
        var initPromise = this.init();
        if (isPromise(initPromise)) {
            initPromise.then(resolve, reject);
        } else {
            resolve();
        }
    },

    init: function () {
        return Promise.resolve();
    },

    finalize: function () {}
};

function isPromise(object) {
    return object && isFunction(object.then);
}

function isFunction(fn) {
    return typeof fn === 'function'
}

function safeCall(fn) {
    if (isFunction(fn)) {
        fn();
    }
}

module.exports = new BaseModule();
