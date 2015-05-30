'use strict';

var express = require('express');

express.request.getProvider = function (providerName) {
    var Klass = require('./' + providerName);
    return new Klass(this);
};
