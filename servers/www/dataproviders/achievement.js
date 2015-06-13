'use strict';

var debug = require('debug')('app:providers');
var moment = require('moment');
var Q = require('q');
var constants = require('../../common/constants');

// TODO req.moment
moment.locale('ru');

var utils = require('./utils');

var i = 0;
var labelThemes = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

function getLabelTheme() {
    i++;
    if (i > labelThemes.length - 1) {
        i = 0;
    }
    return labelThemes[i];
}

function AchievementProvider(req) {
    this.req = req || {};
}

AchievementProvider.prototype = {
    constructor: AchievementProvider,

    getAll: function () {
        return utils.askApi(this.req, '/all-achievements').then(function (achievements) {
            return achievements.map(this.normalize.bind(this));
        }.bind(this));
    },

    get: function (id) {
        return utils.askApi(this.req, '/achievement/' + id).then(this.normalize.bind(this));
    },

    // TODO return achievement
    find: function (str) {
        return utils.askApi(this.req, '/suggest/achievement/' + encodeURIComponent(str));
    },

    update: function (id, data) {
        return utils.askApi(this.req, '/achievement/' + id, {
            method: 'POST',
            body: data
        });
    },

    create: function (achievement) {
        return utils.askApi(this.req, '/achievement', {
            method: 'PUT',
            body: achievement
        }).then(this.normalize.bind(this));
    },

    normalize: function (achievement) {
        achievement.currentUser = {
            received: false,
            created: false
        };

        if (this.req.user) {
            var receivedAchievements = this.req.user.receivedAchievements.map(function (achievement) {
                return achievement.id;
            });
            var createdAchievements = this.req.user.createdAchievements.map(function (achievement) {
                return achievement.id;
            });
            achievement.currentUser.received = receivedAchievements.indexOf(achievement.id) !== -1;
            achievement.currentUser.created = createdAchievements.indexOf(achievement.id) !== -1;
        }

        var certProvider = new (require('./cert'))(this.req);
        achievement.parents = (achievement.parents || []).map(this.normalize.bind(this));
        achievement.children = (achievement.children || []).map(this.normalize.bind(this));
        achievement.certificates = (achievement.certificates || []).map(certProvider.normalize.bind(certProvider));

        achievement.tags = (achievement.tags || []).map(function (tag) {
            tag.theme = getLabelTheme();
            return tag;
        });

        debug('Achievement: ' + JSON.stringify(achievement));
        return achievement;
    },

    createCert: function (achievementId, cert) {
        return utils.askApi(this.req, '/achievement/' + achievementId + '/certs', {
            method: 'POST',
            body: {
                type: constants.CERT_TYPE[cert.type],
                uses: Number(cert.uses),
                achievementId: Number(achievementId)
            }
        });
    }
};

module.exports = AchievementProvider;
