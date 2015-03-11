/**
 * Initializer contains initialization logic for all other modules
 *
 * For proper work each module should contain this attributes:
 * {String} name - name of the module
 * {Function} [__init] - should do init logic and call passed callback with initialization error,
 * should do init logic only once, but call callback with success or error for any attempt for reinitialization
 *
 * If some module doesn't contain __init method,
 * Initializer won't catch any errors (and won't have ability to repeat init process).
 *
 * Usage:
 * In some module, that have dependencies from m1 and m2
 * and want to do some things only after m1 and m2 would be both initialized
 * var m1 = require('./module1');
 * var m2 = require('./module2');
 * require('./initializer').initModules([m1, m2], startMyLogic);
 * function startMyLogic() {...}
 *
 */
'use strict';

var console = require('./console');

var INIT_AFTER_FAIL_TIMEOUT = 444;

var Initializer = function () {};

Initializer.prototype = {
    initModules: function (modules, callback) {
        var promises = [];

        modules.forEach(function (module) {
            promises.push(this._initModule(module));
        }, this);

        Promise.all(promises).then(
            // При успешном выполнении Promise.all возвращает массив.
            function () {
                callback();
            },
            callback
        );
    },

    _initModule: function (module) {
        return new Promise(function (resolve, reject) {
            this._tryCallInit({
                module: module,
                resolve: resolve,
                reject: reject,
                catchErrors: true
            });
        }.bind(this));
    },

    _tryCallInit: function (options) {
        var initPromise = createInitPromise(options.module);

        if (options.catchErrors) {
            initPromise.catch(this._catchInitError.bind(this, options));
        } else {
            initPromise.catch(options.reject);
        }

        initPromise.then(options.resolve);
    },

    _catchInitError: function(options, error) {
        if (options.catchErrors) {
            options.catchErrors = false;
            this._initModuleAfterTimeout(options);
        } else {
            options.reject(error);
        }
    },

    _initModuleAfterTimeout: function(options) {
        setTimeout(
            this._tryCallInit.bind(null, options),
            INIT_AFTER_FAIL_TIMEOUT
        );
    }
};

function createInitPromise(module) {
    return new Promise(function (resolve, reject) {
        if (typeof module.__init !== 'function') {
            console.log('Module %s do not have __init method', module.name);

            resolve();
        }

        callInitMethod(module, resolve, reject);
    });
}

function callInitMethod(module, resolve, reject) {
    try {
        module.__init(function(error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    } catch (error) {
        reject(error);
    }
}


module.exports = new Initializer();
