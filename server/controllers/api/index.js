module.exports = function (app) {
    app.get('/api/v1/whoami', require('./whoami'));
    app.get('/api/v1/token', require('./token'));
    app.get('/api/v1/time', require('./time'));
    app.post('/api/v1/dump', require('./dump'));
};
