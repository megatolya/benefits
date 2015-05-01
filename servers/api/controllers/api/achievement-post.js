'use strict';

var _ = require('lodash');
var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Achievement.find(req.params.id)
        .then(function (achievement) {
            return achievement.update(req.body);
        })
        .then(res.sendStatus.bind(res, 200))
        .catch(next);
};
