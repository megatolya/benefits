'use strict';

var db = require('./db');
var _ = require('lodash');

var User = require('./models/user');
var Achievement = require('./models/achievement');
var Rule = require('./models/rule');
var Hits = require('./models/hits');

var devData = {
    achievements: [
        {
            id: 1,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            title: 'Вконтактер',
            description: 'Был на вконтакте',
            image: 'vk.png',
            rules: [1]
        },
        {
            id: 2,
            title: 'Вконтактер 80 уровня',
            description: 'Много раз был на вконтакте',
            parent: 'vk1',
            image: 'vk.png',
            rules: [2]
        },
        {
            id: 3,
            title: 'Павел Дуров',
            description: 'Очень много раз был на вконтакте',
            parent: 'vk2',
            image: 'durov.jpg',
            rules: [3, 4]
        },
        {
            id: 4,
            title: 'Одноклассник',
            description: 'Много раз был на одноклассниках',
            image: 'ok.png',
            rules: [5]
        }
    ],

    rules: [
        {
            id: 1,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            hits: 10
        }, {
            id: 2,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            hits: 20
        }, {
            id: 3,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            hits: 30
        }, {
            id: 4,
            type: 'navigation',
            url: 'https?:\\/\\/(www\\.)?(ok\\.ru|odnoklassniki\\.ru)\\/.*',
            hits: 30
        }, {
            id: 5,
            type: 'navigation',
            url: 'https?:\\/\\/(www\\.)?(durov\\.ru)\\/.*',
            hits: 1
        }
    ],

    users: [
        {
            id: 1,
            salt: 'salt1',
            name: 'Николай',
            achievements: [1]
        },
        {
            id: 2,
            salt: 'salt2',
            name: 'Степан',
            achievements: [4]
        },
        {
            id: 3,
            salt: 'salt3',
            name: 'Наташа',
            achievements: [1, 2, 3]
        }
    ],

    hits: [
        {
            UserId: 1,
            RuleId: 1,
            hits: 12
        }
    ]
};

module.exports = {
    create: function () {
        this._createAchievements(devData.achievements);
        this._createRules(devData.rules);
        this._createUsers(devData.users);
        this._createHits(devData.hits);
    },

    _createAchievements: function (achievements) {
        achievements.forEach(function (ach) {
            var achDataToSave = _.extend({}, ach);
            delete achDataToSave.rules;
            Achievement.create(achDataToSave)
                .then(this._linkAchievementsWithRules.bind(this, ach));
        }, this);
    },

    _linkAchievementsWithRules: function (achievementData, achievementModel) {
        achievementModel.setRules(achievementData.rules);
    },

    _createRules: function (rules) {
        rules.forEach(function (rule) {
            Rule.create(rule);
        });
    },

    _createUsers: function (users) {
        users.forEach(function (user) {
            var userToSave = _.extend({}, user);
            delete userToSave.achievements;
            User.create(user)
                .then(this._linkUserWithAchievements.bind(this, user));
        }, this);
    },

    _linkUserWithAchievements: function (userData, userModel) {
        userModel.setAchievements(userData.achievements);
    },

    _createHits: function (hits) {
        hits.forEach(function (hit) {
            Hits.create(hit);
        });
    }
};
