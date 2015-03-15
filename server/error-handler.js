module.exports = function(err, req, res, next) {
    if (typeof err === 'number') {
        res.sendStatus(err);
        res.end();
    }

    console.error('Failed', err);
};
