'use strict';

var models = require('../../db/models');

module.exports = function (req, res, next) {
    var query = decodeURI(req.params.query);
    models.User.findAll({
        where: {
            name: {
                $iLike: '%' + query + '%'
            }
        }
    }).then(function (users) {
        res.json(users.map(function (user) {
            return {
                id: user.id,
                name: user.name
            };
        }));
    }, next);
};
