'use strict';

var userProvider = require('../../dataproviders/user');
var passport = require('passport');
var debug = require('debug')('app:user-serializer');

passport.serializeUser(function (user, done) {
    debug('Serialize user: ', user.id);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    debug('Deserialize user: ', id);
    userProvider.get(id)
        .then(function (user) {
            debug('User loaded!');
            done(null, user);
        })
        .fail(done);
});
