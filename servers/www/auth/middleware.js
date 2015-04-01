'use strict';

var sidToUid = Object.create(null);
var config = require('../../config');

module.exports = function (req, res, next) {
    function logAndCallNext(authorized) {
        console.log(req.path, authorized ? '(authorized)' : '(not authorized)');
        next();
    }

    var header = req.headers[config.uidHeader];
    // uid ставится или заголовком (из расширения)
    // или через авторизацию на сайте
    if (req.session.uid) {
        req.uid = req.session.uid;
        req.fromExtension = Boolean(header);
        logAndCallNext(true);
        return;
    }

    if (header) {
        req.session.uid = req.uid = header;
        logAndCallNext(true);
        return;
    }

    logAndCallNext(false);
};
