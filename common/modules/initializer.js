/**
 * Initializer contains initialization logic for all other modules
 *
 * For proper work each module should contain this attributes:
 * {String} name - name of the module
 * {Function} __init - should do init logic and call passed callback with initialization error
 * {Function} __onInit - should call passed callback after completed initialization
 *
 * If some module doesn't contain __init method,
 * Initializer won't catch any errors (and won't have ability to repeat init process).
 *
 * If some module doesn't contain onInit method,
 * Initializer will pretend that this module have been already initialized
 *
 * Usage:
 * In app.js (or in any other module that responsible for initialization of all other modules)
 * var m1 = require('./module1');
 * var m2 = require('./module2');
 * require('./initializer').initModules([m1, m2]);
 *
 * In some module, that have dependencies from m1 and m2
 * and want to do some things only after m1 and m2 would be both initialized
 * var m1 = require('./module1');
 * var m2 = require('./module2');
 * require('./initializer').waitForInit([m1, m2], startMyLogic);
 * function startMyLogic() {...}
 *
 */
'use strict';

var async = require('async');
var console = require('./console');

var INIT_AFTER_FAIL_TIMEOUT = 444;

var Initializer = function () {};

Initializer.prototype = {
    initModules: function (modules) {
        modules.forEach(function (module) {
            this.initModule(module, true);
        }, this);
    },

    initModule: function (module, catchErrors) {
        var initPromise = createInitPromise(module);
        if (catchErrors && initPromise) {
            initPromise.catch(this._catchInitError.bind(this, module));
        }
    },

    waitForInit: function (modules, callback) {
        var tasks = [];
        modules.forEach(function (module) {
            tasks.push(getOnInitMethod(module));
        });
        async.parallel(tasks, callback);
    },

    _catchInitError: function (module) {
        // TODO pass catchErrors = false after several attempts (not after first)
        this._initModuleAfterTimeout(module, false);
    },

    _initModuleAfterTimeout: function(module, catchErrors) {
        setTimeout(
            this.initModule.bind(null, module, catchErrors),
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

function getOnInitMethod(module) {
    if (typeof module.__onInit === 'function') {
        return module.__onInit;
    }
    console.log('Module %s do not have onInit method', module.name);
    return onInitHelperMethod;
}

function onInitHelperMethod(callback) {
    callback();
}

module.exports = new Initializer();
