'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Achievement.create(req.body)
        .then(function (achievement) {
            res.status(201);
            res.json(achievement);
        })
        .catch(next);
};
