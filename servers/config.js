'use strict';

var Q = require('q');
var argv = require('minimist')(process.argv.slice(2));

Q.longStackSupport = true;

module.exports = {
    apiServer: {
        scheme: 'http',
        port: 3000,
        host: 'localhost'
    },

    webServer: {
        scheme: 'http',
        port: 3001,
        host: 'localhost'
    },

    cookie: {
        secret: 'cook it bitch'
    },

    session: {
        secret: 'russia'
    },

    // TODO get secrets from environment variables
    providers: {
        twitter: {
            name: 'twitter',
            key: 'xr3M1vwLGBRI91jgYqn4WKfYb',
            secret: 'wNWTdK1x5fOUKeDXBTpMAbMPpJ2Oc9JE5V1Vbhwtw1gEpgDyt5'
        },
        facebook: {
            name: 'facebook',
            key: '255470687970868',
            secret: 'a6e2830ab502a59b5c7192f60c4ec1ef'
        }
    },

    db: {
        userHits: {
            connectionUrl: 'mongodb://localhost:27017/user-hits'
        },

        userAchievements: {
            connectionUrl: 'mongodb://localhost:27017/user-achievements'
        },

        users: {
            connectionUrl: 'mongodb://localhost:27017/users'
        },

        achievements: {
            connectionUrl: 'mongodb://localhost:27017/achievements'
        }
    },

    tokens: {
        whoami: 'whoami_her_na_rilo'
    },

    get useToken() {
        if ('token' in argv) {
            return argv.token;
        }

        return true;
    },

    get isTestsRunning() {
        return Boolean(process.env.TEST || argv.tests);
    },

    get uidHeader() {
        return 'x-uid';
    }
};
