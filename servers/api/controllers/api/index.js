'use strict';

module.exports = function (app) {
    app.get('/api/v1/whoami', require('./whoami'));
    app.get('/api/v1/token', require('./token'));
    app.get('/api/v1/rules', require('./rules'));
    app.get('/api/v1/achievements', require('./achievements'));
    app.get('/api/v1/user/:uid', require('./user'));

    app.get('/api/v1/all-achievements', require('./allAchievements'));
    app.get('/api/v1/achievement/:id', require('./achievement'));

    app.post('/api/v1/dump', require('./dump'));
};
