'use strict';

module.exports = {
    port: 3000,

    cookie: {
        secret: 'cook it bitch'
    },

    session: {
        secret: 'russia'
    },

    db: {
        dumps: {
            connectionUrl: 'mongodb://localhost:27017/dumps'
        },

        users: {
            connectionUrl: 'mongodb://localhost:27017/users'
        }
    },

    tokens: {
        whoami: 'whoami_her_na_rilo'
    }
};
