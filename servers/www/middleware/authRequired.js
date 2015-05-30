'use strict';

module.exports = function (req, res, next) {
    if (!req.user) {
        if (req.xhr) {
            res.status(401).end();
        } else {
            res.redirect('/auth');
        }
    } else {
        next();
    }
};
