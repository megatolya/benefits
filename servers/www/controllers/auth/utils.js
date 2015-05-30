'use strict';

var config = require('../../../config');
var userProvider = require('../../dataproviders/user');
var _ = require('lodash');
var debug = require('debug')('AuthHelper');

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

    /**
     * Returns callback url for given provider name
     * @param {string} provider
     * @returns {string}
     */
    getCallbackUrl: function (provider) {
        var webServer = config.webServer;
        return webServer.scheme + '://' + webServer.host + ':' +
                webServer.port + '/auth/' + provider + '/callback';
    },

    /**
     * Creates user data for given provider name
     * Adds name, [provider]Id and [provider]Data fields to result object
     * @param {string} provider
     * @param {object} profile
     * @param {object} customData
     * @returns {object}
     */
    createUserData: function (provider, profile, customData) {
        var userData = {};
        userData.name = profile.displayName;
        userData[provider + 'Id'] = profile.id;
        userData[provider + 'Data'] = _.extend(this.cleanProfile(profile), customData);
        return userData;
    },

    /**
     * Saves user to db (or updates, if user already exists)
     * @param {{provider: string, userData: object}} options
     * @param {function} done
     */
    finishAuth: function (options, done) {
        return userProvider
            .put(options.provider, options.userData)
            .then(function (user) {
                debug('User saved', user.id);
                done(null, user);
            })
            .fail(done);
    }
};
