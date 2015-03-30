'use strict';

module.exports = function (app) {
    app.get('/me', function (req, res) {
        res.json({hello: 'world'});
    });
};
