'use strict';

var config = require('../../../config');

module.exports = {
    /**
     * Deletes all keys with '_' from profile
     * @param {Object} profile
     */
    cleanProfile: function (profile) {
        Object.keys(profile).forEach(function (key) {
            if (key.indexOf('_') === 0) {
                delete profile[key];
            }
        });
        return profile;
    },

    getCallbackUrl: function (provider) {
        var webServer = config.webServer;
        return webServer.scheme + '://' + webServer.host + ':' +
                webServer.port + '/auth/' + provider + '/callback';
    }
};
