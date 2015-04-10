'use strict';

var achievementsProvider = require('../../dataproviders/achievements');

module.exports = function (app) {
    app.get('/achievements', function (req, res, next) {
        achievementsProvider.getAll().then(function (achievements) {
            res.magicRender('achievements/catalogue', req, {
                achievements: achievements
            });
        }).fail(next);
    });

    app.get('/achievements/new', function (req, res, next) {
        res.magicRender('achievements/new', req);
    });

    app.get('/achievements/:id', function (req, res, next) {
        achievementsProvider.get(req.params.id).then(function (achievement) {
            res.magicRender('achievements/achievement', req, {
                achievement: achievement
            });
        }).fail(next);
    });
};
