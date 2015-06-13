'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Certificate.findById(req.params.id)
        .then(res.json.bind(res))
        .catch(next);
};
