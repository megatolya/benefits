'use strict';

var userProvider = require('../../dataproviders/user');
var passport = require('passport');

passport.serializeUser(function (user, done) {
    console.log('serialize user: ', user.id);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log('deserialize user with id: ', id);
    userProvider.get(id)
        .then(function (user) {
            console.log('user loaded');
            done(null, user);
        })
        .fail(done);
});
