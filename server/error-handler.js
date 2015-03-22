'use strict';

module.exports = function (err, req, res, next) {
    if (typeof err === 'number') {
        res.sendStatus(err);
        res.send('Ololo ' + err);
        res.end();
    }

    console.error('Failed', err.message);
    console.error('Failed', err.stack);
};
