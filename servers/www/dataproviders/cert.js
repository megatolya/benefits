'use strict';

var debug = require('debug')('app:providers');
var moment = require('moment');
var Q = require('q');
var constants = require('../../common/constants');
var utils = require('./utils');

// TODO req.moment
moment.locale('ru');

function CertProvider(req) {
    this.req = req || {};
}

CertProvider.prototype = {
    constructor: CertProvider,

    get: function (id) {
        return utils.askApi(this.req, '/certificate/' + id).then(this.normalize.bind(this));
    },

    normalize: function (cert) {
        var req = this.req;

        cert.created = moment(cert.createdAt, 'YYYYMMDD').fromNow();
        cert.link = req.origin + '/cert/' + cert.referer;
        debug('cert', cert);
        return cert;
    }
};

module.exports = CertProvider;
