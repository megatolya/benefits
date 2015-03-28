'use strict';

var Q = require('q');
var argv = require('minimist')(process.argv.slice(2));

Q.longStackSupport = true;

module.exports = {
    port: 3000,

    cookie: {
        secret: 'cook it bitch'
    },

    session: {
        secret: 'russia'
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
    }
};
