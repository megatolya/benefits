'use strict';

module.exports = function (app) {
    app.get('/auth', function (req, res, next) {
        res.magicRender('auth', req);
        next();
    });
};
