var db = require('../db');

function log(req, status, params) {
    console.log(req.method + ' ' + req.path + ' (' + status + ')', params || '');
}

module.exports = function (req, res, next) {
    var params = req.query;

    if (!params.token || !params.uid) {
        req.authorized = false;
        log(req, 'unauthorized');
        next();
        return;
    } else {
        req.checkToken(params.token, params.uid).then(function() {
            req.authorized = true;
            req.uid = params.uid;
            log(req, 'authorized');
            next();
        }).fail(function(reason) {
            req.authorized = false;
            log(req, 'mamkin haker', reason);
            next();
        });
    }
};
