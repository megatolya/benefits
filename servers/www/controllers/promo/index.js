'use strict';

module.exports = function (app) {
    app.get('/promo', function (req, res, next) {
        res.magicRender('promo', req);
        next();
    });
};
