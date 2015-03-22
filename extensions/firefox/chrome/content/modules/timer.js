'use strict';

const {
    classes: Cc,
    interfaces: Ci,
    utils: Cu,
    results: Cr
} = Components;

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');

/**
 * @constructor
 *
 * @param {Object} aOptions
 *      {Function} callback - функция вызываемая, когда истечет тайм-аут
 *      {Object} context - контекст выполнения функции
 *      {Number} delay - время ожидания перед выполнением
 *      {Number} type - тип выполняемого таймера: Timer.TYPE
 */
function Timer(aOptions) {
    if (typeof aOptions.callback !== 'function') {
        throw new Error('Timer callback should be a function.');
    }

    if (isNaN(aOptions.delay) || aOptions.delay < 0) {
        throw new Error('Timer delay should be positive number in milliseconds.');
    }

    if (!aOptions.type) {
        aOptions.type = Timer.TYPE.ONCE;
    }

    let type;
    switch (aOptions.type) {
        case Timer.TYPE.ONCE:
            type = Ci.nsITimer.TYPE_ONE_SHOT;
            break;

        case Timer.TYPE.REPEAT:
            type = Ci.nsITimer.TYPE_REPEATING_SLACK;
            break;

        default:
            throw new Error('Unknown timer type. ' + aOptions.type);
    }

    this._callback = aOptions.callback;

    this._timer = Cc['@mozilla.org/timer;1'].createInstance(Ci.nsITimer);
    this._timer.initWithCallback(aOptions.callback.bind(aOptions.context), aOptions.delay, type);
}

Timer.TYPE = {
    ONCE: 0x1,
    REPEAT: 0x2
};

Object.defineProperty(Timer.prototype, 'callback', {
    enumberable: true,

    get: function () {
        return this._callback;
    }
});

Object.defineProperty(Timer.prototype, 'delay', {
    enumberable : true,

    get: function () {
        return  this._timer && this._timer.delay;
    }
});

Object.defineProperty(Timer.prototype, 'type', {
    enumberable : true,

    get: function () {
        // FIXME: Отдавать nsITimer.type?
        return  this._timer && this._timer.type;
    }
});

Timer.prototype.cancel = function () {
    if (this._timer) {
        this._timer.cancel();
        this._timer = null;
    }

    this._callback = null;
};

function ProgressiveTimer(aOptions) {
    if (typeof aOptions.callback !== 'function') {
        throw new Error('Timer callback should be a function.');
    }

    if (isNaN(aOptions.scale) || aOptions.scale < 0) {
        aOptions.scale = 2;
    }

    this._counter = 1;
    this._factor = aOptions.scale;
    this._callback = aOptions.callback;

    this._setTimer(aOptions.callback.bind(aOptions.context), aOptions.delay);
}

ProgressiveTimer.prototype = Object.create(Timer.prototype);
ProgressiveTimer.prototype.constructor = ProgressiveTimer;

Object.defineProperty(ProgressiveTimer.prototype, 'factor', {
    enumberable : true,

    get: function () {
        return this._factor;
    }
});

ProgressiveTimer.prototype._setTimer = function (aCallback, aDelay) {
    let delay = aDelay;
    if (this._conuter > 1) {
        delay *= this._factor;
    }

    var next = function () {
        this._counter++;

        this._setTimer(aCallback, delay);
    }.bind(this);

    var stop = function () {
        this.cancel();
    }.bind(this);

    this._timer = new Timer({
        callback: () => {
            try {
                aCallback(stop, next);
            } catch (e) {
                stop();
            }
        },
        delay: delay
    });
};

module.exports = {
    shot: function (aCallback, aDelay, aContext) {
        return new Timer({
            callback: aCallback,
            context: aContext,
            delay: aDelay
        });
    },

    interval: function (aCallback, aDelay, aContext) {
        return new Timer({
            callback: aCallback,
            context: aContext,
            delay: aDelay,
            type: Timer.TYPE.REPEAT
        });
    },

    /**
     * Возвращает таймер, выполняющий переданную функцию через тайм-ауты геометрической прогрессии.
     *
     * @param {progressiveTimerCallback} aCallback - вызываемая функция
     * @param {Number} aDelay - первая задержка в милисекундах
     * @param {Number} [aScaleFactor=2] - знаменатель прогрессии тайм-аута
     */
    progressive: function (aCallback, aDelay, aScaleFactor = 2, aContext = undefined) {
        return new ProgressiveTimer({
            callback: aCallback,
            context: aContext,
            delay: aDelay,
            scale: aScaleFactor
        });
    }
};

/**
 * @callback progressiveTimerCallback
 *
 * @param {Function} stop - функция, вызываемая для индикации остановки выполнения таймера
 * @param {Function} next - функция, вызываемая для индикации ожидания следующего тайм-аута
 */
