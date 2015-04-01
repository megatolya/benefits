'use strict';

var ls = window.localStorage;

module.exports = {
    set: function (key, value) {
        ls.setItem(key, JSON.stringify(value));
    },

    get: function (key) {
        return JSON.parse(ls.getItem(key));
    }
};
