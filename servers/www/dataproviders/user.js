'use strict';

var utils = require('./utils');

function UserProvider(req) {
    this.req = req || {};
}

UserProvider.prototype = {
    constructor: UserProvider,

    get: function (uid) {
        return utils.askApi(this.req, '/user/' + uid);
    },

    find: function (str) {
        return utils.askApi(this.req, '/suggest/user/' + encodeURIComponent(str));
    },

    put: function (provider, userData) {
        return utils.askApi(this.req, '/user', {
            method: 'PUT',
            body: {
                provider: provider,
                userData: userData
            }
        });
    }
};

module.exports = UserProvider;
