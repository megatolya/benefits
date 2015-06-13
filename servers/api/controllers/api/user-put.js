'use strict';

var auth = require('../../auth');
var models = require('../../db/models');
var socialCrawlers = require('../../social-crawlers');
var debug = require('debug')('app:user-put');

function registerUser(userData, provider, res) {
    return auth.registerUser(userData).then(function (user) {
        debug('New user has been created: ', user.id);
        socialCrawlers.crawl(user, provider);
        res.json(user);
    });
}

function updateUser(user, userData, provider, res) {
    var idFieldName = provider + 'Id';
    var dataFieldName = provider + 'Data';
    user[idFieldName] = String(userData[idFieldName]);
    user[dataFieldName] = userData[dataFieldName];
    return user.save().then(function () {
        debug('User has been updated: %s', user.id);
        socialCrawlers.crawl(user, provider);
        res.json(user);
    });
}

function createQuery(userData, provider) {
    var dataToFind = {};
    var idFieldName = provider + 'Id';
    dataToFind[idFieldName] = userData[idFieldName];
    if (userData.id) {
        dataToFind.id = userData.id;
        dataToFind = {$or: dataToFind};
    }
    return dataToFind;
}

module.exports = function (req, res, next) {
    var provider = req.body.provider;
    var userData = req.body.userData;
    var idFieldName = provider + 'Id';
    userData[idFieldName] = String(userData[idFieldName]); // social id should be string

    var dataToFind = createQuery(userData, provider);
    debug('query: %o', dataToFind);

    models.User.scope('withAchievements')
        .find({where: dataToFind})
        .then(function (user) {
            if (user) {
                return updateUser(user, userData, provider, res);
            } else {
                return registerUser(userData, provider, res);
            }
        })
        .catch(next);
};
