'use strict';

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
        achievement.received = false;

        if (this.req.user) {
            var achievementsIds = this.req.user.achievements.map(function (achievement) {
                return achievement.id;
            });
            achievement.received = achievementsIds.indexOf(achievement.id) !== -1;
        }

        if (achievement.parents) {
            achievement.parents = achievement.parents.map(this.normalize.bind(this));
        }

        if (achievement.children) {
            achievement.children = achievement.children.map(this.normalize.bind(this));
        }

        achievement.tags = (achievement.tags || []).map(function (tag) {
            tag.theme = getLabelTheme();
            return tag;
        });

        return achievement;
    }
};

module.exports = AchievementProvider;
