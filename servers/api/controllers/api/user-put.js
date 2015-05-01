'use strict';

var auth = require('../../auth');
var models = require('../../db/models');

module.exports = function (req, res, next) {
    var provider = req.body.provider;
    var userData = req.body.userData;

    var dataToFind = {};
    var idFieldName = provider + 'Id';
    dataToFind[idFieldName] = userData[idFieldName];

    models.User.scope('withAchievements')
        .find({where: dataToFind})
        .then(function (user) {
            if (user) {
                res.json(user);
            } else {
                return auth.registerUser(userData)
                    .then(res.json.bind(res));
            }
        })
        .catch(next);
};
