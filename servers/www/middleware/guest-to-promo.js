'use strict';

module.exports = function (req, res, next) {
    if (!req.user) {
        res.redirect('/promo');
    }
    next();
};
