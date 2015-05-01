'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    models.Achievement.findWithParents(req.params.id)
        .then(function (achievement) {
            res.json(achievement);
        }).catch(next);

};
