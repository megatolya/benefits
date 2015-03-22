'use strict';

var ss = require('specific/storage');

module.exports = {
    set: function (key, value) {
        // TODO do some crypto magic
        ss.set(key, value);
    },

    get: function (key) {
        // TODO undo some crypto magic
        return ss.get(key);
    }
};
