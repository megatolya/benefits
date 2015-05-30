'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    var query = decodeURI(req.params.query);

    models.Achievement.findAll({
        where: {
            name: {
                $iLike: '%' + query + '%'
            }
        }
    }).then(function (achievements) {
        res.json(achievements.map(function (user) {
            return {
                id: user.id,
                name: user.name
            };
        }));
    }, next);
};
