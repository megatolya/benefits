'use strict';

var db = require('../../db');
var _ = require('lodash');
var console = require('../../console');

module.exports = function (req, res, next) {
    db.achievements.get(req.params.id).then(function (achievement) {
        _.assign(achievement, req.body);
        db.achievements.update(achievement).then(function () {
            res.status(200);
            res.end();
        }, next);
    }, next);
};
