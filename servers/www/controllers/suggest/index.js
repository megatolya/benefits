'use strict';

var uniq = require('../../../common/uniq');

module.exports = function (app) {
    app.get('/suggest/user/', function (req, res) {
        function send(users) {
            res.json({
                users: users
            });
        }

        req.getProvider('user').find(req.query.q).then(send, send.bind(null, []));
    });

    app.get('/suggest/achievement/', function (req, res) {
        function send(achievements) {
            res.json({
                // FIXME :)
                users: achievements
            });
        }

        req.getProvider('achievement').find(req.query.q).then(send, send.bind(null, []));
    });
};
