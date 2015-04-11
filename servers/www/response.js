'use strict';

var express = require('express');
var config = require('../config');
var _ = require('lodash');
var i18n = require('./i18n');

module.exports = function () {};

express.response.magicRender = function (templateName, req, params) {
    return this.render(templateName, _.extend(config, {
        uid: req.uid,
        path: req.path,
        description: 'FIXME',
        i18n: i18n[req.getLang()],
        user: req.user
    }, params || {}));
};
