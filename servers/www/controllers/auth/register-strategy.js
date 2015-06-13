'use strict';

var passport = require('passport');
var authUtils = require('./utils');
var debug = require('debug')('app:common-auth-strategy');

function createStrategyOptions(options) {
    if (options.strategyOptions) {
        options.strategyOptions.passReqToCallback = true;
        return options.strategyOptions;
    }
    return {
        passReqToCallback: true,
        clientID: options.config.key,
        clientSecret: options.config.secret,
        callbackURL: authUtils.getCallbackUrl(options.config.name)
    };
}

function createCallback(options) {
    if (options.callback) {
        return options.callback;
    }
    var config = options.config;
    return function (req, accessToken, refreshToken, profile, done) {
        authUtils.finishAuth({
            provider: config.name,
            userData: authUtils.createUserData(
                config.name, profile,
                {accessToken: accessToken, refreshToken: refreshToken},
                req.user
            )
        }, done);
    };
}

module.exports = function (options) {
    var Strategy = options.strategy;
    var strategyOptions = createStrategyOptions(options);
    var callback = createCallback(options);
    passport.use(new Strategy(strategyOptions, callback));
};
