'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Achievement.findAll()
        .then(function (results) {
            res.json(results);
        })
        .catch(next);
};
