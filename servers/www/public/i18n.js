'use strict';

/* global _i18n, _lang */

window.i18n = {
    get: function (str) {
        var keys = str.split('.');
        var lang = this.getLanguage();
        var val = _i18n[lang];
        var key;

        do {
            key = keys.shift();
            val = val[key];
            if (!val) {
                console.warn('no such key', lang + '.' + str);
                return str;
            }
        } while (keys.length);
        return val;
    },

    getLanguage: function () {
        return _lang;
    }
};
