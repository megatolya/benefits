'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Achievement.create(req.body)
        .then(res.sendStatus.bind(res, 201))
        .catch(next);
};
