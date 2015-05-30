'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Achievement.getFullData(req.params.id)
        .then(res.json.bind(res))
        .catch(next);
};
