'use strict';

var models = require('../../db/models');
var debug = require('debug')('user-get');

module.exports = function (req, res, next) {
    var uid = req.params.uid;

    if (!uid) {
        debug('uid is missing');
        res.status(400);
        return;
    }

    // TODO delete salt
    models.User.scope('withAchievements')
        .find(uid)
        .then(res.json.bind(res))
        .catch(next);
};
