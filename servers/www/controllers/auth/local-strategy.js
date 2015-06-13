'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
      done({});
  }
));

module.exports = function (app) {
    app.get('/auth/instagram', passport.authenticate('instagram'));
    app.get('/auth/instagram/callback',
        passport.authenticate(
            'instagram',
            {successRedirect: '/', failureRedirect: '/auth'}
        ));
};
