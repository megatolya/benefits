'use strict';

var userProvider = require('../../dataproviders/user');
var guestToPromo = require('../../middleware/guest-to-promo');

module.exports = function (app) {
    app.get('/me', guestToPromo, function (req, res, next) {
        res.magicRender('profile', req);
    });
};
