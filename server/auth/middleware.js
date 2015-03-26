'use strict';

var db = require('../db');
var config = require('../config');
var console = require('../console');

function log(req, status, params) {
    console.log(req.method + ' ' + req.path + ' (' + status + ')', params || '');
}

module.exports = function (req, res, next) {
    var params = req.query;

    req.uid = params.uid;
    req.authorized = false;

    if (!params.token && config.useToken) {
        log(req, 'unauthorized');
        next();
        return;
    } else {
        req.checkToken(params.token, params.uid).then(function () {
            req.authorized = true;
            log(req, 'authorized');
            next();
        }).fail(function (reason) {
            log(req, 'mamkin haker or new user', reason);
            next();
        });
    }
};
