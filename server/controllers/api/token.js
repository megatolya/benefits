'use strict';

var db = require('../../db');
var auth = require('../../auth');

module.exports = function (req, res, next) {
    db.getUserByUserId(req.uid).then(function (user) {
        var token = req.query.token;
        var validToken = auth.generateToken(req.uid, (user || {}).salt, 'token');

        res.json({
            token: {
                authorized: req.authorized,
                validToken: validToken,
                gotToken: token,
                tokensEquals: validToken === token,
                userFound: Boolean(user)
            }
        });
    }).fail(function (reason) {
        res.json({
            token: {
                authorized: req.authorized,
                validToken: validToken,
                gotToken: token,
                tokensEquals: validToken === token,
                userFound: false,
                error: (reason || {}).message || null
            }
        });
    });
};
