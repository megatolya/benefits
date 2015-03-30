'use strict';

var express = require('express');
var config = require('../config');
var app = express();
var cookieParser = require('cookie-parser');
var serve = require('serve-static');
var bodyParser = require('body-parser');
var session = require('express-session');
var uuid = require('node-uuid');

app.disable('x-powered-by');
app.disable('etag');

app.set('trust proxy', 1);
app.set('case sensitive routing', true);

app.set('views', './views');
app.set('view engine', 'jade');

app.use(session({
    genid: function (req) {
        return uuid.v4();
    },
    secret: config.session.secret
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser(config.cookie.secret));
app.use(require('./auth/middleware'));

require('./controllers/morda')(app);
require('./controllers/profile')(app);

app.use(require('./error-handler'));

app.listen(config.webServer.port);
console.log('WEB server http://localhost:' + config.webServer.port);

if (config.isTestsRunning) {
    throw new Error('there is no tests for web site yet');
}
