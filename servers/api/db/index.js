'use strict';

var _ = require('lodash');
var debug = require('debug')('db-init');

var db = require('./db');

module.exports = {
    options: {
        initDevData: false
    },

    init: function (options) {
        options = options || {};
        this.options = _.extend(this.options, options || {});
        return db.sync({force: options.force}).then(this._onInit.bind(this));
    },

    _onInit: function () {
        debug('initialization completed');
    }
};
