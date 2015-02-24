'use strict';

EXPORTED_SYMBOLS = ['application'];

let application = {
    get core() {
        return this._core;
    },

    init: function (aCore) {
        this._core = aCore;

        this._createUI();
    },

    finalize: function () {
        this._destroyUI();

        this._core = null;
    }

    _createUI: function () {

    },

    _destroyUI: function () {

    }
}
