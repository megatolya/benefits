'use strict';

module.exports = function (app) {
    app.get('/api/v1/whoami', require('./whoami'));
    app.get('/api/v1/token-check', require('./token'));
    app.post('/api/v1/dump', require('./dump'));
};
