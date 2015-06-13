'use strict';

var models = require('../../db/models');
var uniq = require('../../../common/uniq');

module.exports = function (req, res, next) {
    var cert = req.body;
    cert.used = 0;
    cert.referer = uniq();

    models.Certificate.create(cert).then(function (cert) {
        res.status(201);
        res.json(cert);
    }).catch(next);
};
