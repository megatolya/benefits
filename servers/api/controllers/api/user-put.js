'use strict';

var db = require('../../db');
var Q = require('q');
var auth = require('../../auth');
var console = require('../../console');

module.exports = function (req, res, next) {
    auth.registerUser(req.body)
        .then(res.json.bind(res))
        .fail(next);
};
