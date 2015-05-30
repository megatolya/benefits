'use strict';

var Q = require('q');
var ask = require('vow-asker');
var config = require('../../config');
var _ = require('lodash');

module.exports = {
    askApi: function (req, path, options) {
        var args = [].slice.call(arguments);
        args[0] = 'api';
        options = args[2] = options || {};

        if (req.user) {
            options.headers = _.assign(options.headers || {}, {
                'X-Uid': req.user.id
            });
        }

        return this.askProvider.apply(this, args);
    },

    askProvider: function (provider, path, options) {
        if (provider === 'api') {
            path = '/api/v1' + path;
        } else {
            return Q.reject(new TypeError('Unknown provider ' + provider));
        }

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

        return Q.reject(new Error('failed to parse json: ' + json));
    }
};
