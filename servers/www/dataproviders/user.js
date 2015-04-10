'use strict';

var utils = require('./utils');

module.exports = {
    get: function (uid) {
        return utils.askApi('/api/v1/user/' + uid);
    },
    put: function (userData) {
        return utils.askApi('/api/v1/user', {method: 'PUT', body: userData});
    }
};
