'use strict';

var models = require('../../db/models');
var debug = require('debug')('app:user-get');

module.exports = function (req, res, next) {
    var uid = req.params.uid;

    if (!uid) {
        debug('uid is missing');
        res.status(400);
        return;
    }

    // TODO delete salt
    models.User.getFullData(uid)
        .then(res.json.bind(res))
        .catch(next);
};
