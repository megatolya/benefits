'use strict';

var userProvider = require('../../dataproviders/user');
var _ = require('lodash');

module.exports = function (app) {
    app.get('/', function (req, res, next) {
        if (!req.uid) {
            res.render('promo');
            return;
        }

        userProvider.get(req.uid).then(function (user) {
            res.render('dashboard', _.extend({
                user: user,
            }, req.getRequestData()));
        }).fail(next);
    });
};
