'use strict';

module.exports = function (app) {
    function get() {
        arguments[0] = '/api/v1' + arguments[0];
        app.get.apply(app, arguments);
    }

    function post() {
        arguments[0] = '/api/v1' + arguments[0];
        app.post.apply(app, arguments);
    }

    function put() {
        arguments[0] = '/api/v1' + arguments[0];
        app.put.apply(app, arguments);
    }

    get('/all-achievements', require('./allAchievements'));
    get('/achievement/:id', require('./achievement'));

    post('/achievement/:id', require('./achievement-post'));

    put('/achievement/', require('./achievement-put'));

    get('/user/:uid', require('./user-get'));
    put('/user', require('./user-put'));

    get('/suggest/user/:query', require('./userSuggest'));
    get('/suggest/achievement/:query', require('./achievementSuggest'));
};
