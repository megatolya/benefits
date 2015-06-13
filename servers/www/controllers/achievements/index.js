'use strict';

var images = require('../../images');
var path = require('path');
var uniq = require('../../../common/uniq');
var authRequired = require('../../middleware/authRequired');
var checkAchievementOwner = require('../../middleware/checkAchievementOwner');

module.exports = function (app) {
    app.get('/achievements', function (req, res, next) {
        req.getProvider('achievement').getAll().then(function (achievements) {
            res.magicRender('achievements/catalogue', req, {
                achievements: achievements
            });
        }).fail(next);
    });

    app.get('/achievements/new', authRequired, function (req, res, next) {
        res.magicRender('achievements/new', req, {
            token: uniq()
        });
    });

    app.post('/achievements/receive', function (req, res, next) {
        console.log('session', req.session);
    });

    app.get('/achievements/:id', function (req, res, next) {
        req.getProvider('achievement').get(req.params.id).then(function (achievement) {
            res.magicRender('achievements/achievement', req, {
                achievement: achievement
            });
        }, next);
    });

    app.post('/achievements/new-image', authRequired, function (req, res, next) {
        res.status(201);
        res.end();
    });

    app.post('/achievements/new', authRequired, function (req, res, next) {
        var imageId = uniq();

        req.getProvider('achievement').create({
            name: req.body.name,
            description: req.body.description,
            image: '/achievements/' + imageId + '.png',
            creatorId: req.user.id
        }).then(function (achievement) {
            var id = achievement.id;
            var from = path.resolve(__dirname + '/../../../../' + './temp/' + req.body.token + '.png');
            var to = path.resolve(__dirname + '/../../../../' + './public/achievements/' + imageId + '.png');
            images.crop(from, to).then(function () {
                res.redirect('/achievements/' + id);
            }, next);
        }, next);
    });

    app.post('/achievements/:id', authRequired, function (req, res, next) {
        req.getProvider('achievement').update(req.params.id, req.body).then(function (achievement) {
            res.status(200);
            res.end();
        }).fail(function () {
            res.status(200);
            res.end();
        });
    });
};
