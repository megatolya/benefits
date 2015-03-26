'use strict';

module.exports = function (err, req, res, next) {
    if (typeof err === 'number') {
        res.status(err);
        res.json({status: 'error', errorCode: err});
        return;
    }

    console.error('Failed', err.message);
    console.error('Failed', err.stack);
    res.status(500);
    res.json({status: 'error', errorCode: 500, errorMessage: err.message});
};
