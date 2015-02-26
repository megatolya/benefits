'use strict';

const EXPORTED_SYMBOLS = ['application'];

let application = {
    init: function (aCore) {
        this._core = aCore;
    },

    finalize: function () {
        this._core = null;
    }
}
