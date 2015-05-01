'use strict';

var uniq = require('../../../common/uniq');

module.exports = function (app) {
    app.get('/users-suggest', function (req, res) {
        var users = [];

        for (var i = 0; i < 10 ; i++) {
            users.push({
                id: uniq(),
                name: req.query.q + i
            });
        }

        res.json({
            users: users
        });
    });

    app.get('/achievements-suggest', function (req, res) {
        var users = [];

        for (var i = 0; i < 10 ; i++) {
            users.push({
                id: uniq(),
                name: req.query.q + i
            });
        }

        res.json({
            users: users
        });
    });
};
