'use strict';

var express = require('express');
var config = require('../config');
var _ = require('lodash');
var i18n = require('./i18n');

module.exports = function () {};

express.response.magicRender = function (templateName, req, params) {
    return this.render(templateName, _.assign(config, {
        uid: req.uid,
        path: req.path,
        description: 'FIXME',
        i18n: {
            get: function (str) {
                var keys = str.split('.');
                var lang = req.getLang();
                var val = i18n[lang];
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

            lang: req.getLang()
        },
        user: req.user
    }, params || {}));
};
