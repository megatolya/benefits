'use strict';

var userProvider = require('../../dataproviders/user');
var _ = require('lodash');

module.exports = function (app) {
    app.get('/', function (req, res, next) {
        if (!req.user) {
            res.render('promo');
            return;
        }

        res.magicRender('dashboard', req, req.user);
    });
};
