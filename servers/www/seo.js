'use strict';

var express = require('express');
var config = require('../config');
var _ = require('lodash');

module.exports = function (app) {
};

express.request.getRequestData = function () {
    return _.extend(config, {
        uid: this.uid,
        path: this.path,
        description: 'FIXME'
    });
};
