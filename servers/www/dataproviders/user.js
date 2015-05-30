'use strict';

var utils = require('./utils');

module.exports = {
    get: function (uid) {
        return utils.askApi('/api/v1/user/' + uid);
    },

    find: function (str) {
        return utils.askApi('/api/v1/suggest/user/' + encodeURIComponent(str));
    },

    put: function (provider, userData) {
        return utils.askApi('/api/v1/user', {
            method: 'PUT',
            body: {
                provider: provider,
                userData: userData
            }
        });
    }
};
