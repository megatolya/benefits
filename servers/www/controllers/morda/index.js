'use strict';

var guestToPromo = require('../../middleware/guest-to-promo');
var _ = require('lodash');

module.exports = function (app) {
    app.get('/', guestToPromo, function (req, res, next) {
        res.magicRender('dashboard', req);
    });
};
