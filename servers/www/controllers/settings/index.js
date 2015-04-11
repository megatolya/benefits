'use strict';

var guestToAuth = require('../../middleware/guest-to-auth');

module.exports = function (app) {
    app.get('/settings', guestToAuth, function (req, res, next) {
        res.magicRender('settings', req);
        next();
    });
};
