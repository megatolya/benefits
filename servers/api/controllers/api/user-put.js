'use strict';

var auth = require('../../auth');
var models = require('../../db/models');
var socialCrawlers = require('../../social-crawlers');
var debug = require('debug')('UserPut');

function registerUser(userData, provider, res) {
    return auth.registerUser(userData)
        .then(function (user) {
            debug('New user has been created: ', user.id);
            socialCrawlers.crawl(user, provider);
            res.json(user);
        });
}

module.exports = function (req, res, next) {
    var provider = req.body.provider;
    var userData = req.body.userData;

    var dataToFind = {};
    var idFieldName = provider + 'Id';
    userData[idFieldName] = String(userData[idFieldName]); // social id should be string
    dataToFind[idFieldName] = userData[idFieldName];

    models.User.scope('withAchievements')
        .find({where: dataToFind})
        .then(function (user) {
            if (user) {
                debug('User already exist: ', user.id);
                socialCrawlers.crawl(user, provider);
                res.json(user);
            } else {
                return registerUser(userData, provider, res);
            }
        })
        .catch(next);
};
