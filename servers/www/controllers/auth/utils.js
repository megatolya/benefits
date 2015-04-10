'use strict';

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
    }
};
