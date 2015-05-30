'use strict';

var express = require('express');
var config = require('../config');
var app = express();
var cookieParser = require('cookie-parser');
var serve = require('serve-static');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var passport = require('passport');
var multer  = require('multer');
var easyimage = require('easyimage');
var fs = require('q-io/fs');

app.disable('x-powered-by');
app.disable('etag');

app.set('trust proxy', 1);
app.set('case sensitive routing', true);

app.set('views', path.resolve(path.join(__dirname, 'views')));
app.set('view engine', 'jade');

app.use(serve(path.join(__dirname, '..', '..', '/public')));

app.use(session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false
}));

app.use(cookieParser(config.cookie.secret));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// parse multipart
app.use(multer({dest: './temp/',
    rename: function (fieldname, filename, req) {
        return req.body.token;
    },
    onFileUploadComplete: function (file) {
        var extname = path.extname(file.path);
        if (extname !== '.png') {
            easyimage.convert({
                src: file.path,
                dst: file.path.replace(extname, '.png')
            }).then(function () {
                fs.remove(file.path);
            });
        }
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./middleware/auth'));

require('./dataproviders');

require('./request')(app);
require('./response')(app);

require('./controllers/morda')(app);
require('./controllers/profile')(app);
require('./controllers/settings')(app);
require('./controllers/achievements')(app);
require('./controllers/auth')(app);
require('./controllers/suggest')(app);

app.use(require('./error-handler'));

app.listen(config.webServer.port);
console.log('WEB server http://localhost:' + config.webServer.port);
