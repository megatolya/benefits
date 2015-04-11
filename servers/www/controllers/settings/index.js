'use strict';

module.exports = function (app) {
    app.get('/settings', function (req, res, next) {
        res.magicRender('settings', req);
        next();
    });
};
