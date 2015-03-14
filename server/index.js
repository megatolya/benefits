require('./express-extensions');
var express = require('express');
var config = require('./config');
var app = express();
var cookieParser = require('cookie-parser');
var serve = require('serve-static');


app.set('env', process.env.NODE_ENV);
app.disable('x-powered-by');
app.disable('etag');
app.set('trust proxy', 1);
app.set('case sensitive routing', true);

app.set('views', './views');
app.set('view engine', 'jade');

app.use(cookieParser(config.cookie.secret));
app.use(require('./session-manager'));

require('./controllers/api')(app);

app.listen(config.port);
console.log('http://localhost:' + config.port);
