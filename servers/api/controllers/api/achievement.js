'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Achievement.findWithParents(req.params.id)
        .then(res.json.bind(res))
        .catch(next);
};
