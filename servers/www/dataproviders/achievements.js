'use strict';

var utils = require('./utils');

module.exports = {
    getAll: function () {
        return utils.askApi('/api/v1/all-achievements');
    },

    get: function (id) {
        return utils.askApi('/api/v1/achievement/' + id);
    }
};
