'use strict';

module.exports = function (err, req, res, next) {
    if (typeof err === 'number') {
        res.status(err);

        if (err === 401 && req.user) {
            res.magicRender('errors/401');
            return;
        }

        res.json({status: 'error', errorCode: err});
        return;
    }

    console.error('Failed', err.message);
    console.error('Failed', err.stack);
    res.status(500);
    if (req.xhr) {
        res.json({status: 'error', errorCode: 500, errorMessage: err.message});
    } else {
        res.end(err.message);
    }
};
