'use strict';

var express = require('express');
var config = require('../config');
var _ = require('lodash');
var i18n = require('./i18n');

module.exports = function () {};

express.request.getLang = function () {
    return 'ru';
};
