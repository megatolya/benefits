'use strict';

var guestToPromo = require('../../middleware/guest-to-promo');
var userProvider = require('../../dataproviders/user');

module.exports = function (app) {
    app.get('/me', guestToPromo, function (req, res, next) {
        res.magicRender('profile', req, {
            user: req.user
        });
    });

    app.get('/user/:userId', function (req, res, next) {
        userProvider.get(req.params.userId).then(function (user) {
            res.magicRender('profile', req, {
                user: user
            });
        }, next);
    });
};
