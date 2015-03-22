'use strict';

var ls = window.localStorage;

module.exports = {
    set: function (key, value) {
        ls.setItem(key, value);
    },

    get: function (key) {
        return ls.getItem(key);
    }
};
