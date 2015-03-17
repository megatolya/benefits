'use strict';

var SignalJS = require('signals');

var foo = function () {};

function Signal(addedHandler, removedHandler) {
    this._signal = new SignalJS();
    this._addedHandler = addedHandler || foo;
    this._removedHandler = removedHandler || foo;
}

Signal.prototype = {
    has: function (listener, context) {
        return this._signal.has(listener, context);
    },

    add: function (listener, listenerContext, priority) {
        var alreadyHas = this.has(listener, listenerContext);
        this._signal.add(listener, listenerContext, priority);
        this._handleAdded(listener, listenerContext, priority, alreadyHas);
    },

    addOnce: function (listener, listenerContext, priority) {
        var alreadyHas = this.has(listener, listenerContext);
        this._signal.addOnce(listener, listenerContext, priority);
        this._handleAdded(listener, listenerContext, priority, alreadyHas);
    },

    remove: function (listener, context) {
        var prevListenersNumber = this.getNumListeners();
        this._signal.remove(listener, context);
        this._handleRemoved(listener, context, prevListenersNumber);
    },

    removeAll: function () {
        var prevListenersNumber = this.getNumListeners();
        var removedListeners = getListeners(this._signal);
        this._signal.removeAll();
        this._handleRemovedAll(removedListeners, prevListenersNumber);
    },

    getNumListeners: function () {
        return this._signal.getNumListeners();
    },

    halt: function () {
        this._signal.halt();
    },

    dispatch: function (params) {
        this._signal.dispatch(params);
    },

    forget: function () {
        this._signal.forget();
    },

    dispose: function () {
        var prevListenersNumber = getNumListeners(this._signal);
        var removedListeners = getListeners(this._signal);
        this._signal.dispose();
        this._handleRemovedAll(removedListeners, prevListenersNumber);
    },

    toString: function () {
        this._signal.toString();
    },

    _handleAdded: function (listener, listenerContext, priority, alreadyHas) {
        if (alreadyHas) {
            return;
        }
        this._addedHandler({
            listener: listener,
            context: listenerContext,
            priority: priority,
            isNew: this._signal.getNumListeners() === 1
        });
    },

    _handleRemoved: function (listener, context, prevListenersNum) {
        var currentListenersNum = getNumListeners(this._signal);
        if (prevListenersNum === currentListenersNum) {
            return;
        }
        this._removedHandler({
            listener: listener,
            context: context,
            isLast: currentListenersNum === 0 && prevListenersNum === 1
        });
    },

    _handleRemovedAll: function (listeners, prevListenersNum) {
        listeners.forEach(function (listenerData) {
            this._handleRemoved(listenerData.listener, listenerData.context, prevListenersNum);
            prevListenersNum -= 1;
        }, this);
    }
};

function getListeners(signal) {
    if (!signal._bindings) {
        return [];
    }
    return signal._bindings.map(function (binding) {
        return {
            listener: binding.getListener(),
            context: binding.context
        };
    });
}

function getNumListeners(signal) {
    try {
        return signal.getNumListeners();
    } catch (e) {
        return 0;
    }
}

module.exports = Signal;
