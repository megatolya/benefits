'use strict';

var images = require('../../images');
var achievementsProvider = require('../../dataproviders/achievements');
var path = require('path');
var uniq = require('../../../common/uniq');

module.exports = function (app) {
    app.get('/achievements', function (req, res, next) {
        achievementsProvider.getAll().then(function (achievements) {
            res.magicRender('achievements/catalogue', req, {
                achievements: achievements
            });
        }).fail(next);
    });

    app.get('/achievements/new', function (req, res, next) {
        res.magicRender('achievements/new', req, {
            token: uniq()
        });
    });

    app.get('/achievements/:id', function (req, res, next) {
        achievementsProvider.get(req.params.id).then(function (achievement) {
            res.magicRender('achievements/achievement', req, {
                achievement: achievement
            });
        }).fail(next);
    });

    app.post('/achievements/new-image', function (req, res, next) {
        res.status(201);
        res.end();
    });

    app.post('/achievements/new', function (req, res, next) {
        var id = uniq();
        var from = path.resolve(__dirname + '/../../../../' + './temp/' + req.body.token + '.png');
        var to = path.resolve(__dirname + '/../../../../' + './public/achievements/' + id + '.png');

        images.crop(from, to).then(function () {
            var achievement = {
                id: id,
                title: req.body.title,
                description: req.body.description,
                image: '/achievements/' + id + '.png'
            };

            achievementsProvider.create(achievement);
            res.redirect('/achievements/' + id);
        }, next);
    });

    app.post('/achievements/:id', function (req, res, next) {
        console.log(req.body);
        achievementsProvider.post(req.params.id, req.body).then(function (achievement) {
            res.status(200);
            res.end();
        }).fail(function () {
            res.status(200);
            res.end();
        });
    });
};
