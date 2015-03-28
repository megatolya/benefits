'use strict';

function Timer(timerType, callback, delay) {
    this._startTimer = window['set' + timerType].bind(undefined);
    this._cancelTimer = window['clear' + timerType].bind(undefined);

    this._timerId = this._startTimer(callback, delay);
}

Timer.prototype = {
    cancel: function () {
        this._cancelTimer(this._timerId);
    }
};

module.exports = {
    shot: function (callback, delay, ctx) {
        return new Timer('Timeout', callback.bind(ctx), delay);
    },
    interval: function (callback, delay, ctx) {
        return new Timer('Interval', callback.bind(ctx), delay);
    }
};
