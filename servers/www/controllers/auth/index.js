'use strict';

module.exports = function (app) {
    app.get('/auth', function (req, res, next) {
        res.magicRender('auth', req);
        next();
    });

    require('./serialize-users');
    require('./twitter-strategy')(app);
    require('./facebook-strategy')(app);
    require('./github-strategy')(app);
    require('./instagram-strategy')(app);
    require('./local-strategy')(app);
};
