'use strict';

var db = require('../../db');

module.exports = function (req, res, next) {
    var uid = req.params.uid;

    if (!uid) {
        console.log('not a uid: ', uid);
        res.status(400);
        return;
    }

    db.users.get(uid).then(function (user) {
        res.json(user);
    }).fail(next);
};
