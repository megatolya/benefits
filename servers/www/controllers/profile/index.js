'use strict';

var userProvider = require('../../dataproviders/user');

module.exports = function (app) {
    app.get('/me', function (req, res, next) {
        if (!req.uid) {
            res.render('promo');
            return;
        }

        userProvider.get(req.uid).then(function (user) {
            res.magicRender('profile', req, user);
        }).fail(next);
    });
};
