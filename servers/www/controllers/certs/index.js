'use strict';

var authRequired = require('../../middleware/authRequired');
var checkAchievementOwner = require('../../middleware/checkAchievementOwner');
var Q = require('q');

module.exports = function (app) {
    app.get('/achievements/:id/certs', authRequired, checkAchievementOwner, function (req, res, next) {
        req.getProvider('achievement').get(req.params.id).then(function (achievement) {
            res.magicRender('certs', req, {
                achievement: achievement
            });
        }, next);
    });
    app.get('/achievements/:id/certs/:certId', authRequired, checkAchievementOwner, function (req, res, next) {
        req.getProvider('cert').get(req.params.certId).then(function (cert) {
            res.magicRender('partials/cert-modal', req, {
                cert: cert
            });
        });
    });

    app.post('/achievements/:id/certs', authRequired, checkAchievementOwner, function (req, res, next) {
        req.getProvider('achievement').createCert(req.params.id, req.body).then(function (cert) {
            res.redirect(req.originalUrl + '?from=creation');
        });
    });

    app.get('/cert/:referer', function (req, res, next) {
        req.getProvider('cert').getByReferer(req.params.referer)
            .then(function (cert) {
                return Q.all([cert, req.getProvider('achievement').get(cert.achievementId)]);
            })
            .spread(function (cert, achievement) {
                console.log('cert', cert);
                console.log('achievement', achievement);
                res.magicRender('cert', req, {
                    achievement: achievement,
                    cert: cert
                });
            }, next);
    });
};
