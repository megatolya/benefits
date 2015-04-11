'use strict';

var userProvider = require('../../dataproviders/user');

module.exports = function (app) {
    app.get('/me', function (req, res, next) {
        if (!req.user) {
            res.render('promo');
            return;
        }

        res.magicRender('profile', req);
    });
};
