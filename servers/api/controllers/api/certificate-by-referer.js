'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Certificate.find({
        where: {
            referer: req.params.referer
        }
    })
        .then(res.json.bind(res))
        .catch(next);
};
