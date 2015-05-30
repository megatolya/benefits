'use strict';

var authRequired = require('../../middleware/authRequired');

module.exports = function (app) {
    app.get('/settings', authRequired, function (req, res, next) {
        res.magicRender('settings', req);
    });
};
