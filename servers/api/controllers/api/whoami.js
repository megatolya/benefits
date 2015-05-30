'use strict';

var auth = require('../../auth');
var md5 = require('MD5');
var config = require('../../../config');
var validToken = md5(config.tokens.whoami);
var debug = require('debug')('app:whoami');

debug('validToken for whoami', validToken);

module.exports = function (req, res, next) {

    if (req.query.token !== validToken && config.useToken) {
        debug('wrong token ' + req.query.token);
        return next(403);
    }

    auth.registerUser().then(function (userInfo) {
        res.status(201);
        res.json({
            whoami: {
                uid: userInfo.id,
                salt: userInfo.salt
            }
        });
    }).fail(next);
};
