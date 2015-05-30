'use strict';

var uniq = require('../../../common/uniq');
var userProvider = require('../../dataproviders/user.js');
var achievementProvider = require('../../dataproviders/achievement');

module.exports = function (app) {
    app.get('/suggest/user/', function (req, res) {
        function send(users) {
            res.json({
                users: users
            });
        }

        userProvider.find(req.query.q).then(send, send.bind(null, []));
    });

    app.get('/suggest/achievement/', function (req, res) {
        function send(achievements) {
            res.json({
                // FIXME :)
                users: achievements
            });
        }

        achievementProvider.find(req.query.q).then(send, send.bind(null, []));
    });
};
