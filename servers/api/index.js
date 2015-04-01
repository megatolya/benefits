'use strict';

var express = require('express');
var config = require('../config');
var app = express();
var cookieParser = require('cookie-parser');
var serve = require('serve-static');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

app.disable('x-powered-by');
app.disable('etag');

app.set('trust proxy', 1);
app.set('case sensitive routing', true);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(require('./auth/middleware'));

require('./controllers/api')(app);

app.use(require('./error-handler'));

app.listen(config.apiServer.port);
console.log('API server http://localhost:' + config.apiServer.port);

if (config.isTestsRunning) {
    require('./tests/')(app);
}
