'use strict';

var _ = require('lodash');
var debug = require('debug')('db-init');

var db = require('./db');
var devData = require('./dev-data');

module.exports = {
    options: {
        initDevData: false
    },

    init: function (options) {
        this.options = _.extend(this.options, options);
        return db.sync({force: options.force}).then(this._onInit.bind(this));
    },

    _onInit: function () {
        debug('initialization completed');
        if (this.options.initDevData) {
            debug('creating dev data');
            devData.create();
        }
    }
};
