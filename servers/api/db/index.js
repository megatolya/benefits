'use strict';

var debug = require('debug')('db');
var Sequelize = require('sequelize');
var execSync = require('child_process').execSync;

// TODO get real dbName, userName and password.
var whoami = execSync('whoami'); // it is Buffer
var userName = whoami.toString('utf8', 0, whoami.length - 1); // delete '\n' from the end
var dbName = userName;
var password = null;

debug('user - %s, db - %s', userName, dbName);

var sequelize = new Sequelize(dbName, userName, password, {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: debug,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

sequelize.st = Sequelize;

module.exports = sequelize;
