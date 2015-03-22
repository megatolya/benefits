'use strict';

var auth = require('../../auth');
var md5 = require('MD5');
var config = require('../../config');
var validToken = md5(config.tokens.whoami);

console.log('validToken for whoami', validToken);

module.exports = function (req, res, next) {

    if (req.query.token !== validToken && config.useToken) {
        console.error('wrong token', req.query.token);
        return next(401);
    }

    auth.registerUser().then(function (userInfo) {
        res.json({
            whoami: {
                uid: userInfo.id,
                salt: userInfo.salt
            }
        });
    }).fail(next);
};
