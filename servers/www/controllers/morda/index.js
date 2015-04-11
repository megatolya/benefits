'use strict';

var _ = require('lodash');

module.exports = function (app) {
    app.get('/', function (req, res, next) {
        if (req.user) {
            res.magicRender('dashboard', req);
        } else {
            res.magicRender('promo', req);
        }
    });
};
