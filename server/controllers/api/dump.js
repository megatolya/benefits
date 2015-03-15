var db = require('../../db');

// TODO next?
function onFail(reason) {
    console.error('Failed to append log because', reason.message || reason);
}

module.exports = function (req, res, next) {
    res.sendStatus(202);
    res.end();

    var log = null;
    try {
        log = JSON.parse(req.body.log);
    } catch (err) {}

    if (!log) {
        console.error('Failed to parse log', req.body.log);
        return;
    }

    req.getUserId().then(function(userId) {
        db.appendUserData(userId, log).fail(onFail);
    }).fail(onFail);
};
