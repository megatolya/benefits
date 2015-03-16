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
        this._signal.has(listener, context);
    },

    add: function (listener, listenerContext, priority) {
        this._signal.add(listener, listenerContext, priority);
        this._handleAdded(listener, listenerContext, priority);
    },

    addOnce: function (listener, listenerContext, priority) {
        this._signal.addOnce(listener, listenerContext, priority);
        this._handleAdded(listener, listenerContext, priority);
    },

    remove: function (listener, context) {
        this._signal.remove(listener, context);
        this._handleRemoved(listener, context);
    },

    removeAll: function () {
        var removedListeners = getListeners(this._signal);
        this._signal.removeAll();
        this._handleRemovedAll(removedListeners);
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
        var removedListeners = getListeners(this._signal);
        this._signal.dispose();
        this._handleRemovedAll(removedListeners);
    },

    toString: function () {
        this._signal.toString();
    },

    _handleAdded: function (listener, listenerContext, priority) {
        this._addedHandler({
            listener: listener,
            context: listenerContext,
            priority: priority,
            isNew: this._signal.getNumListeners() === 1
        });
    },

    _handleRemoved: function (listener, context) {
        this._removedHandler({
            listener: listener,
            context: context,
            isLast: this._signal.getNumListeners() === 0
        });
    },

    _handleRemovedAll: function (listeners) {
        listeners.forEach(function (listenerData) {
            this._handleRemoved(listenerData.listener, listenerData.context);
        }, this);
    }
};

function getListeners(signal) {
    return signal._bindings.map(function (binding) {
        return {
            listener: binding.getListener(),
            context: binding.context
        };
    });
}

module.exports = Signal;
