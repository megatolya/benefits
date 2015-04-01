'use strict';

var express = require('express');
var config = require('../config');
var app = express();
var cookieParser = require('cookie-parser');
var serve = require('serve-static');
var bodyParser = require('body-parser');
var session = require('express-session');
var uuid = require('node-uuid');
var path = require('path');

app.disable('x-powered-by');
app.disable('etag');

app.set('trust proxy', 1);
app.set('case sensitive routing', true);

app.set('views', path.resolve(path.join(__dirname, 'views')));
app.set('view engine', 'jade');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret: config.session.secret
}));
app.use(cookieParser(config.cookie.secret));

app.use(require('./auth/middleware'));
require('./seo')(app);

require('./controllers/morda')(app);
require('./controllers/profile')(app);

app.use(require('./error-handler'));

app.listen(config.webServer.port);
console.log('WEB server http://localhost:' + config.webServer.port);
