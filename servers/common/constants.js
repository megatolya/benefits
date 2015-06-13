'use strict';

var certTypes = {};

['RECEIVE', 'GIVE', 'ALL'].forEach(function (type, i) {
    certTypes[certTypes[i] = type] = i;
});

module.exports = Object.freeze({
    CERT_TYPE: certTypes
});
