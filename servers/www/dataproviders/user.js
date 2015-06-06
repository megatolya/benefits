'use strict';

var utils = require('./utils');
var achievementProvider = new (require('./achievement'))();
var debug = require('debug')('app:providers');

function UserProvider(req) {
    this.req = req || {};
}

UserProvider.prototype = {
    constructor: UserProvider,

    get: function (uid) {
        return utils.askApi(this.req, '/user/' + uid).then(this.normalize.bind(this));
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
    },

    normalize: function (user) {
        user.achievements = (user.achivements || []).map(function (achievement) {
            return achievementProvider.normalize(achievement);
        });
        user.createdAchievements = (user.createdAchievements || []).map(function (achievement) {
            return achievementProvider.normalize(achievement);
        });
        debug('User: ' + JSON.stringify(user));
        return user;
    }
};

module.exports = UserProvider;
