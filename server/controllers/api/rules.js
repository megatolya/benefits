'use strict';

var achievements = require('../../achievements');

module.exports = function (req, res, next) {
    if (!req.authorized) {
        next(401);
        return;
    }

    achievements.getRulesForUser(req.uid).then(function (rules) {
        res.json({
            rules: {
                navigation: rules
            },
            dom: [],
            bookmarks: []
        });
    }).fail(next);
};
