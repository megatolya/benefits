'use strict';

var images = require('../../images');
var achievementProvider = require('../../dataproviders/achievement');
var path = require('path');
var uniq = require('../../../common/uniq');

module.exports = function (app) {
    app.get('/achievements', function (req, res, next) {
        achievementProvider.getAll().then(function (achievements) {
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
        achievementProvider.get(req.params.id).then(function (achievement) {
            console.log('achievement', achievement);
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
        var imageId = uniq();

        achievementProvider.create({
            name: req.body.name,
            description: req.body.description,
            image: '/achievements/' + imageId + '.png'
        }).then(function (achievement) {
            var id = achievement.id;
            var from = path.resolve(__dirname + '/../../../../' + './temp/' + req.body.token + '.png');
            var to = path.resolve(__dirname + '/../../../../' + './public/achievements/' + imageId + '.png');
            images.crop(from, to).then(function () {
                res.redirect('/achievements/' + id);
            }, next);
        }, next);
    });

    app.post('/achievements/:id', function (req, res, next) {
        achievementProvider.update(req.params.id, req.body).then(function (achievement) {
            res.status(200);
            res.end();
        }).fail(function () {
            res.status(200);
            res.end();
        });
    });
};
