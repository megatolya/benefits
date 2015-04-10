'use strict';

var Q = require('q');
var ask = require('vow-asker');
var config = require('../../config');
var _ = require('lodash');

module.exports = {
    askApi: function (path, options) {
        var requestOptions = _.extend(
            config.apiServer,
            {bodyEncoding: 'json', path: path, method: 'GET'},
            options
        );
        return ask(requestOptions).then(this._onApiResponse.bind(this));
    },

    _onApiResponse: function (res) {
        var json = null;
        try {
            json = JSON.parse(res.data.toString());
        } catch (err) {}

        if (json) {
            return json;
        }

        return Q.reject(json);
    }
};
