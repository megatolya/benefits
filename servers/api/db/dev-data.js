'use strict';

var db = require('./db');
var _ = require('lodash');

var models = require('./models');

var User = models.User;
var Achievement = models.Achievement;
var Rule = models.Rule;
var Hits = models.Hits;

var devData = {
    achievements: [
        {
            // id: 1,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            name: 'Вконтактер',
            description: 'Был на вконтакте',
            image: 'vk.png',
            children: [3],
            rules: [1]
        },
        {
            // id: 2,
            name: 'Вконтактер 80 уровня',
            description: 'Много раз был на вконтакте',
            image: 'vk.png',
            children: [1, 3],
            rules: [2]
        },
        {
            // id: 3,
            name: 'Павел Дуров',
            description: 'Очень много раз был на вконтакте',
            image: 'durov.jpg',
            children: [4],
            rules: [3, 4]
        },
        {
            // id: 4,
            name: 'Одноклассник',
            description: 'Много раз был на одноклассниках',
            image: 'ok.png',
            children: [2],
            rules: [5]
        }
    ],

    rules: [
        {
            // id: 1,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            aim: 10
        }, {
            // id: 2,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            aim: 20
        }, {
            // id: 3,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            aim: 30
        }, {
            // id: 4,
            type: 'navigation',
            url: 'https?:\\/\\/(www\\.)?(ok\\.ru|odnoklassniki\\.ru)\\/.*',
            aim: 30
        }, {
            // id: 5,
            type: 'navigation',
            url: 'https?:\\/\\/(www\\.)?(durov\\.ru)\\/.*',
            aim: 1
        }
    ],

    users: [
        {
            // id: 1,
            salt: 'salt1',
            name: 'Николай',
            achievements: [1]
        },
        {
            // id: 2,
            salt: 'salt2',
            name: 'Степан',
            achievements: [4]
        },
        {
            // id: 3,
            salt: 'salt3',
            name: 'Наташа',
            achievements: [1, 2, 3]
        }
    ],

    hits: [
        {
            userId: 1,
            ruleId: 1,
            count: 12
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
                .then(this._linkAchievementsWithRules.bind(this, ach))
                .then(this._addAchievementChildren.bind(this, ach));
        }, this);
    },

    _linkAchievementsWithRules: function (achievementData, achievementModel) {
        achievementModel.setRules(achievementData.rules);
        return achievementModel;
    },

    _addAchievementChildren: function (achievementData, achievementModel) {
        achievementModel.setChildren(achievementData.children);
        return achievementModel;
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
