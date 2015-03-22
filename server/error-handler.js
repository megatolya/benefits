'use strict';

module.exports = function (err, req, res, next) {
    if (typeof err === 'number') {
        res.sendStatus(err);
        res.end();
        return;
    }

    console.error('Failed', err.message);
    console.error('Failed', err.stack);
};
